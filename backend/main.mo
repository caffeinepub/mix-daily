import Set "mo:core/Set";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type Tool = {
    id : Nat;
    name : Text;
    iconUrl : Text;
    description : Text;
    category : Text;
    pricingTag : Text;
    officialLink : Text;
    createdAt : Int;
    updatedAt : Int;
    isFeatured : Bool;
    isPopular : Bool;
    slug : Text;
    seoTitle : ?Text;
    seoDescription : ?Text;
    seoKeywords : ?Text;
  };

  type ToolSubmission = {
    id : Nat;
    name : Text;
    iconUrl : Text;
    description : Text;
    category : Text;
    pricingTag : Text;
    officialLink : Text;
    submittedAt : Int;
    status : Text; // "pending", "approved", "rejected"
  };

  type ToolCollection = {
    id : Nat;
    name : Text;
    toolIds : [Nat];
    isFeatured : Bool;
    createdAt : Int;
    updatedAt : Int;
  };

  type PaginatedTools = {
    tools : [Tool];
    total : Nat;
    page : Nat;
    pageSize : Nat;
    totalPages : Nat;
  };

  type UserProfile = {
    name : Text;
    email : ?Text;
  };

  // Persistent storage
  var nextToolId : Nat = 1;
  var nextSubmissionId : Nat = 1;
  var nextCollectionId : Nat = 1;
  let tools = Map.empty<Nat, Tool>();
  let toolsBySlug = Map.empty<Text, Nat>();
  let toolSubmissions = Map.empty<Nat, ToolSubmission>();
  let toolCollections = Map.empty<Nat, ToolCollection>();
  let newsletterEmails = Set.empty<Text>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Helper function to generate slug from name
  private func generateSlug(name : Text) : Text {
    let lower = name.toLower();
    let replaced = lower.replace(#text " ", "-");
    replaced.replace(#text "/", "-");
  };

  // Tool Management - Admin Only
  public shared ({ caller }) func addTool(
    name : Text,
    iconUrl : Text,
    description : Text,
    category : Text,
    pricingTag : Text,
    officialLink : Text,
    isFeatured : Bool,
    isPopular : Bool
  ) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add tools");
    };

    let slug = generateSlug(name);
    let now = Time.now();
    let newTool : Tool = {
      id = nextToolId;
      name;
      iconUrl;
      description;
      category;
      pricingTag;
      officialLink;
      createdAt = now;
      updatedAt = now;
      isFeatured;
      isPopular;
      slug;
      seoTitle = null;
      seoDescription = null;
      seoKeywords = null;
    };

    tools.add(nextToolId, newTool);
    toolsBySlug.add(slug, nextToolId);
    let id = nextToolId;
    nextToolId += 1;
    id;
  };

  public shared ({ caller }) func updateTool(
    id : Nat,
    name : Text,
    iconUrl : Text,
    description : Text,
    category : Text,
    pricingTag : Text,
    officialLink : Text,
    isFeatured : Bool,
    isPopular : Bool
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update tools");
    };

    switch (tools.get(id)) {
      case (null) { Runtime.trap("Tool not found"); };
      case (?existingTool) {
        let slug = generateSlug(name);
        let updatedTool : Tool = {
          existingTool with
          name;
          iconUrl;
          description;
          category;
          pricingTag;
          officialLink;
          isFeatured;
          isPopular;
          slug;
          updatedAt = Time.now();
        };
        tools.add(id, updatedTool);
        toolsBySlug.remove(existingTool.slug);
        toolsBySlug.add(slug, id);
      };
    };
  };

  public shared ({ caller }) func deleteTool(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete tools");
    };

    switch (tools.get(id)) {
      case (null) { Runtime.trap("Tool not found"); };
      case (?tool) {
        tools.remove(id);
        toolsBySlug.remove(tool.slug);
      };
    };
  };

  public shared ({ caller }) func updateToolSEO(
    id : Nat,
    seoTitle : ?Text,
    seoDescription : ?Text,
    seoKeywords : ?Text
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update SEO metadata");
    };

    switch (tools.get(id)) {
      case (null) { Runtime.trap("Tool not found"); };
      case (?existingTool) {
        let updatedTool : Tool = {
          existingTool with
          seoTitle;
          seoDescription;
          seoKeywords;
          updatedAt = Time.now();
        };
        tools.add(id, updatedTool);
      };
    };
  };

  public shared ({ caller }) func setToolFeatured(id : Nat, featured : Bool) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can set featured status");
    };

    switch (tools.get(id)) {
      case (null) { Runtime.trap("Tool not found"); };
      case (?existingTool) {
        let updatedTool : Tool = {
          existingTool with
          isFeatured = featured;
          updatedAt = Time.now();
        };
        tools.add(id, updatedTool);
      };
    };
  };

  public shared ({ caller }) func bulkUploadTools(toolsData : [Tool]) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can bulk upload tools");
    };

    for (toolData in toolsData.values()) {
      let slug = generateSlug(toolData.name);
      let now = Time.now();
      let newTool : Tool = {
        toolData with
        id = nextToolId;
        createdAt = now;
        updatedAt = now;
        slug;
      };
      tools.add(nextToolId, newTool);
      toolsBySlug.add(slug, nextToolId);
      nextToolId += 1;
    };
  };

  // Public Tool Queries - No Auth Required
  public query func listTools(page : Nat, pageSize : Nat, filter : ?Text, sortBy : ?Text) : async PaginatedTools {
    let allTools = tools.entries().toArray().map(func((_, tool)) { tool });

    // Apply filters
    var filtered = allTools;
    switch (filter) {
      case (?f) {
        filtered := filtered.filter<Tool>(
          func(t) {
            if (Text.equal(f, "Free")) { Text.equal(t.pricingTag, "Free") }
            else if (Text.equal(f, "Paid")) { Text.equal(t.pricingTag, "Paid") or Text.equal(t.pricingTag, "Freemium") }
            else if (Text.equal(f, "Popular")) { t.isPopular }
            else if (Text.equal(f, "Featured")) { t.isFeatured }
            else { true };
          }
        );
      };
      case null {};
    };

    // Apply sorting
    let sorted = switch (sortBy) {
      case (?"Newest") {
        filtered.sort(func(a, b) { Int.compare(b.createdAt, a.createdAt) });
      };
      case (?"Popular") {
        filtered.sort(func(a, b) {
          if (a.isPopular and not b.isPopular) { #less }
          else if (not a.isPopular and b.isPopular) { #greater }
          else { #equal };
        });
      };
      case (?"Alphabetical") {
        filtered.sort(func(a, b) { Text.compare(a.name, b.name) });
      };
      case _ { filtered };
    };

    let total = sorted.size();
    let actualPageSize = if (pageSize == 0) { 60 } else { pageSize };
    let start = page * actualPageSize;
    let end = start + actualPageSize;

    let paginatedTools =
      if (start >= total) {
        [];
      } else {
        let endIndex = Nat.min(end, total);
        if (start < endIndex) {
          sorted.sliceToArray(start, endIndex);
        } else {
          [];
        };
      };

    let totalPages = if (actualPageSize == 0) { 0 } else { (total + actualPageSize - 1) / actualPageSize };

    {
      tools = paginatedTools;
      total;
      page;
      pageSize = actualPageSize;
      totalPages;
    };
  };

  public query func getToolBySlug(slug : Text) : async ?Tool {
    switch (toolsBySlug.get(slug)) {
      case (null) { null };
      case (?id) { tools.get(id) };
    };
  };

  public query func getTool(id : Nat) : async ?Tool {
    tools.get(id);
  };

  public query func searchTools(searchTerm : Text) : async [Tool] {
    let lowerSearchTerm = searchTerm.toLower();
    let allTools = tools.entries().toArray().map(func((_, tool)) { tool });
    allTools.filter<Tool>(
      func(t) {
        t.name.toLower().contains(#text lowerSearchTerm) or
        t.description.toLower().contains(#text lowerSearchTerm) or
        t.category.toLower().contains(#text lowerSearchTerm)
      }
    );
  };

  public query func getToolsByCategory(category : Text) : async [Tool] {
    let allTools = tools.entries().toArray().map(func((_, tool)) { tool });
    allTools.filter<Tool>(
      func(t) { Text.equal(t.category, category) }
    );
  };

  public query func getFeaturedTools() : async [Tool] {
    let allTools = tools.entries().toArray().map(func((_, tool)) { tool });
    allTools.filter<Tool>(
      func(t) { t.isFeatured }
    );
  };

  public query func getSimilarTools(toolId : Nat, limit : Nat) : async [Tool] {
    switch (tools.get(toolId)) {
      case (null) { [] };
      case (?tool) {
        let allTools = tools.entries().toArray().map(func((_, t)) { t });
        let similar = allTools.filter(
          func(t) { t.id != toolId and Text.equal(t.category, tool.category) }
        );
        let limitedSize = Nat.min(limit, similar.size());
        if (limitedSize > 0) {
          similar.sliceToArray(0, limitedSize);
        } else {
          [];
        };
      };
    };
  };

  // Tool Collections Management - Admin Only
  public shared ({ caller }) func addCollection(name : Text, toolIds : [Nat], isFeatured : Bool) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add collections");
    };

    let now = Time.now();
    let collection : ToolCollection = {
      id = nextCollectionId;
      name;
      toolIds;
      isFeatured;
      createdAt = now;
      updatedAt = now;
    };

    toolCollections.add(nextCollectionId, collection);
    let id = nextCollectionId;
    nextCollectionId += 1;
    id;
  };

  public shared ({ caller }) func updateCollection(id : Nat, name : Text, toolIds : [Nat], isFeatured : Bool) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update collections");
    };

    switch (toolCollections.get(id)) {
      case (null) { Runtime.trap("Collection not found"); };
      case (?existing) {
        let updated : ToolCollection = {
          existing with
          name;
          toolIds;
          isFeatured;
          updatedAt = Time.now();
        };
        toolCollections.add(id, updated);
      };
    };
  };

  public shared ({ caller }) func deleteCollection(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete collections");
    };

    toolCollections.remove(id);
  };

  public query func getCollection(id : Nat) : async ?{
    id : Nat;
    name : Text;
    tools : [Tool];
    isFeatured : Bool;
  } {
    switch (toolCollections.get(id)) {
      case (null) { null };
      case (?collection) {
        let collectionTools = collection.toolIds.map(
          func(toolId) {
            switch (tools.get(toolId)) {
              case (?tool) { ?tool };
              case (null) { null };
            };
          }
        ).filter(
          func(optTool) { switch (optTool) { case (?_) { true }; case (null) { false } } }
        ).map(
          func(optTool) {
            switch (optTool) {
              case (?tool) { tool };
              case (null) { Runtime.trap("Unexpected null value") };
            };
          }
        );
        ?{
          id = collection.id;
          name = collection.name;
          tools = collectionTools;
          isFeatured = collection.isFeatured;
        };
      };
    };
  };

  public query func getFeaturedCollections() : async [{
    id : Nat;
    name : Text;
    tools : [Tool];
    isFeatured : Bool;
  }] {
    let allCollections = toolCollections.entries().toArray().map(func((_, collection)) { collection });
    let featured = allCollections.filter(
      func(c) { c.isFeatured }
    );

    featured.map(
      func(collection) {
        let collectionTools = collection.toolIds.map(
          func(toolId) {
            switch (tools.get(toolId)) {
              case (?tool) { ?tool };
              case (null) { null };
            };
          }
        ).filter(
          func(optTool) { switch (optTool) { case (?_) { true }; case (null) { false } } }
        ).map(
          func(optTool) {
            switch (optTool) {
              case (?tool) { tool };
              case (null) { Runtime.trap("Unexpected null value") };
            };
          }
        );
        {
          id = collection.id;
          name = collection.name;
          tools = collectionTools;
          isFeatured = collection.isFeatured;
        };
      }
    );
  };

  // Tool Submission - Public
  public shared func submitTool(
    name : Text,
    iconUrl : Text,
    description : Text,
    category : Text,
    pricingTag : Text,
    officialLink : Text
  ) : async Nat {
    let submission : ToolSubmission = {
      id = nextSubmissionId;
      name;
      iconUrl;
      description;
      category;
      pricingTag;
      officialLink;
      submittedAt = Time.now();
      status = "pending";
    };

    toolSubmissions.add(nextSubmissionId, submission);
    let id = nextSubmissionId;
    nextSubmissionId += 1;
    id;
  };

  // Tool Submission Review - Admin Only
  public query ({ caller }) func listSubmissions() : async [ToolSubmission] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view submissions");
    };
    toolSubmissions.entries().toArray().map(func((_, submission)) { submission });
  };

  public shared ({ caller }) func approveSubmission(submissionId : Nat) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can approve submissions");
    };

    switch (toolSubmissions.get(submissionId)) {
      case (null) { Runtime.trap("Submission not found"); };
      case (?submission) {
        let slug = generateSlug(submission.name);
        let now = Time.now();
        let newTool : Tool = {
          id = nextToolId;
          name = submission.name;
          iconUrl = submission.iconUrl;
          description = submission.description;
          category = submission.category;
          pricingTag = submission.pricingTag;
          officialLink = submission.officialLink;
          createdAt = now;
          updatedAt = now;
          isFeatured = false;
          isPopular = false;
          slug;
          seoTitle = null;
          seoDescription = null;
          seoKeywords = null;
        };

        tools.add(nextToolId, newTool);
        toolsBySlug.add(slug, nextToolId);

        let updatedSubmission : ToolSubmission = {
          submission with status = "approved";
        };
        toolSubmissions.add(submissionId, updatedSubmission);

        let id = nextToolId;
        nextToolId += 1;
        id;
      };
    };
  };

  public shared ({ caller }) func rejectSubmission(submissionId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can reject submissions");
    };

    switch (toolSubmissions.get(submissionId)) {
      case (null) { Runtime.trap("Submission not found"); };
      case (?submission) {
        let updatedSubmission : ToolSubmission = {
          submission with status = "rejected";
        };
        toolSubmissions.add(submissionId, updatedSubmission);
      };
    };
  };

  // Newsletter - Public Signup
  public shared func subscribeNewsletter(email : Text) : async () {
    newsletterEmails.add(email);
  };

  // Newsletter - Admin Export
  public query ({ caller }) func getNewsletterEmails() : async [Text] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can export newsletter emails");
    };
    newsletterEmails.values().toArray();
  };

  // Admin tool list
  public query ({ caller }) func adminListTools() : async [Tool] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can access admin tool list");
    };
    tools.entries().toArray().map(func((_, tool)) { tool });
  };
};
