import Map "mo:core/Map";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import OutCall "http-outcalls/outcall";

actor {
  type ConversationId = Nat;
  type Message = {
    role : Text;
    content : Text;
    timestamp : Int;
  };

  type Conversation = {
    var name : Text;
    var messages : List.List<Message>;
    createdAt : Int;
  };

  let conversations = Map.empty<ConversationId, Conversation>();
  var nextConversationId = 0;

  type ConversationSummary = {
    id : ConversationId;
    name : Text;
    createdAt : Int;
    messageCount : Nat;
  };

  let welcomeSuggestions : [Text] = [
    "What can you do?",
    "Explain quantum computing in simple terms",
    "Help me plan a trip to Japan",
    "Write a poem about the Internet Computer",
    "Give me some programming tips",
  ];

  func getConversationInternal(id : ConversationId) : Conversation {
    switch (conversations.get(id)) {
      case (null) { Runtime.trap("Conversation not found") };
      case (?conv) { conv };
    };
  };

  module ConversationSummary {
    public func compareByCreatedAt(a : ConversationSummary, b : ConversationSummary) : Order.Order {
      Int.compare(b.createdAt, a.createdAt);
    };
    public func compare(a : ConversationSummary, b : ConversationSummary) : Order.Order {
      Text.compare(a.name, b.name);
    };
    public func compareById(a : ConversationSummary, b : ConversationSummary) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  // Create new conversation
  public shared ({ caller }) func createConversation(name : Text) : async ConversationId {
    let id = nextConversationId;
    let conversation : Conversation = {
      var name;
      var messages = List.empty<Message>();
      createdAt = Time.now();
    };
    conversations.add(id, conversation);
    nextConversationId += 1;
    id;
  };

  // List conversations
  public query ({ caller }) func listConversations() : async [ConversationSummary] {
    conversations.entries().map(func(entry) {
      let (id, conv) = entry;
      {
        id;
        name = conv.name;
        createdAt = conv.createdAt;
        messageCount = conv.messages.size();
      };
    }).toArray().sort(ConversationSummary.compareByCreatedAt);
  };

  // Rename conversation
  public shared ({ caller }) func renameConversation(id : ConversationId, newName : Text) : async () {
    let conv = getConversationInternal(id);
    conv.name := newName;
  };

  // Delete conversation
  public shared ({ caller }) func deleteConversation(id : ConversationId) : async () {
    if (not conversations.containsKey(id)) {
      Runtime.trap("Conversation does not exist. ");
    };
    conversations.remove(id);
  };

  // Get messages in a conversation
  public query ({ caller }) func getMessages(id : ConversationId) : async [Message] {
    let conv = getConversationInternal(id);
    conv.messages.toArray();
  };

  // Send message and get AI response
  public shared ({ caller }) func sendMessage(conversationId : ConversationId, userMessage : Text) : async Message {
    let conv = getConversationInternal(conversationId);

    let userMsg : Message = {
      role = "user";
      content = userMessage;
      timestamp = Time.now();
    };
    conv.messages.add(userMsg);

    // Make HTTP outcall to AI API
    let aiResponseText = await makeAIRequest(userMessage);

    let aiMsg : Message = {
      role = "assistant";
      content = aiResponseText;
      timestamp = Time.now();
    };
    conv.messages.add(aiMsg);

    aiMsg;
  };

  // Make HTTP outcall to AI API
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public func makeAIRequest(prompt : Text) : async Text {
    let apiUrl = "https://your-backend-api-persistent-entrypoint.com/api/v1/chat/completions";

    await OutCall.httpPostRequest(
      apiUrl,
      [],
      "{ \"prompt\": " # prompt # " }",
      transform,
    );
  };

  // Get welcome suggestions
  public query ({ caller }) func getWelcomeSuggestions() : async [Text] {
    welcomeSuggestions;
  };
};
