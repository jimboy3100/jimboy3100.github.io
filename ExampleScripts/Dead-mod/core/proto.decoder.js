// Welcome! require() some modules from npm (like you were using browserify)
// and then hit Run Code to run your code on the right side.
// Modules get downloaded from browserify-cdn and bundled in your browser.
var Root  = protobuf.Root,
    Type  = protobuf.Type,
    Field = protobuf.Field;


var proto = `syntax="proto3";
message Data {
  int32 contentType = 1;
  uncompressedData uncompressedData = 2;
  //read__TYPE_BYTES compressedData = 3;
  uint32 uncompressedSize = 4;
}
message uncompressedData {
                int32 type = 1;
  
                loginRequestField loginRequestField = 10;///
  
                loginResponseField loginResponseField = 11;///
  
                realmUpgradeRequestField realmUpgradeRequestField = 12;
  
                realmUpgradeResponseField realmUpgradeResponseField = 13;
  
                connectRequestField connectRequestField = 14;
  
                connectResponseField connectResponseField = 15;
  
                deviceTokenUpdateField deviceTokenUpdateField = 16;
  
                disconnectField disconnectField = 20;
  
                reconnectField reconnectField = 21;
  
                noProperResponseField noProperResponseField = 22;

                pingField pingField = 30;

                pongField pongField = 31;

                udpHandshakeField udpHandshakeField = 32;

                configurationChangeField configurationChangeField = 33;

                serverGoingOfflineField serverGoingOfflineField = 34;

                gameEnterRequestField gameEnterRequestField = 40;

                gameEnterResponseField gameEnterResponseField = 41;

                gameJoinedField gameJoinedField = 42;

                gameLobbyEnterRequestField gameLobbyEnterRequestField = 44;

                gameLobbyEnterResponseField gameLobbyEnterResponseField = 45;

                gameLobbyQueueUpdateField gameLobbyQueueUpdateField = 47;
 
                gameArenaDirectionVectorField gameArenaDirectionVectorField = 50;

                gameContinueUpdateRequestField gameContinueUpdateRequestField = 54;

                gameContinueUpdateResponseField gameContinueUpdateResponseField = 55;

                gameArenaLeaderboardField gameArenaLeaderboardField = 60;

                gameArenaStateField gameArenaStateField = 61;

                gameOverField gameOverField = 62;///

                gameArenaPartyCellUpdatesField gameArenaPartyCellUpdatesField = 63;

                gameArenaPartyLeaderboardEntriesUpdatesField gameArenaPartyLeaderboardEntriesUpdatesField = 64;

                gameArenaEventField gameArenaEventField = 65;

                gameArenaCurrentSafeAreaField gameArenaCurrentSafeAreaField = 66;

                gameContinueInfoField gameContinueInfoField = 67;

                gameBattleRoyaleArenaPhaseField gameBattleRoyaleArenaPhaseField = 68;

                gameSessionHighestMassField gameSessionHighestMassField = 69;

                softPurchaseRequestField softPurchaseRequestField = 70;///

                softPurchaseResponseField softPurchaseResponseField = 71;///

                appleInappPurchaseRequestField appleInappPurchaseRequestField = 72;///

                googleInappPurchaseRequestField googleInappPurchaseRequestField = 73;///

                inappPurchaseResponseField inappPurchaseResponseField = 74;///

                walletUpdatesField walletUpdatesField = 75;///

                purchaseWalletUpdatesField purchaseWalletUpdatesField = 76;///

                offerBundleRequestField offerBundleRequestField = 77;

                offerBundleResponseField offerBundleResponseField = 78;

                subscriptionWalletUpdatesField subscriptionWalletUpdatesField = 79;///

                updateUserSettingsRequestField updateUserSettingsRequestField = 80;///

                updateUserSettingsResponseField updateUserSettingsResponseField = 81;///

                userStatsRequestField userStatsRequestField = 82;///

                userStatsResponseField userStatsResponseField = 83;///

                serverToServerGameOverWrapperField serverToServerGameOverWrapperField = 90;

                claimGiftsRequestField claimGiftsRequestField = 100;

                claimGiftsResponseField claimGiftsResponseField = 101;

                sendGiftsField sendGiftsField = 102;

                consumeRequestsField consumeRequestsField = 103;

                requestGiftsField requestGiftsField = 104;

                facebookInvitationRewardUpdatesField facebookInvitationRewardUpdatesField = 105;

                activateTimedEventRequestField activateTimedEventRequestField = 110;///

                activateTimedEventResponseField activateTimedEventResponseField = 111;///

                activateBoostRequestField activateBoostRequestField = 112;///

                activateBoostResponseField activateBoostResponseField = 113;///

                activateQuestRequestField activateQuestRequestField = 114;///

                activateQuestResponseField activateQuestResponseField = 115;///

                userTimedEventUpdatesField userTimedEventUpdatesField = 116;///

                activateUserRewardsRequestField activateUserRewardsRequestField = 117;

                activateUserRewardsResponseField activateUserRewardsResponseField = 118;

                openPotionForProductRequestField openPotionForProductRequestField = 120;///

                openPotionForProductResponseField openPotionForProductResponseField = 121;///

                brewPotionForSlotRequestField brewPotionForSlotRequestField = 122;///

                brewPotionForSlotResponseField brewPotionForSlotResponseField = 123;///

                openPotionForSlotRequestField openPotionForSlotRequestField = 124;///

                openPotionForSlotResponseField openPotionForSlotResponseField = 125;///

                userLeaguesInfoRequestField userLeaguesInfoRequestField = 130;

                userLeaguesInfoResponseField userLeaguesInfoResponseField = 131;

                userLeaguesPassUpdateField userLeaguesPassUpdateField = 132;

                userPartyCreateResponseField userPartyCreateResponseField = 141;

                userPartyJoinRequestField userPartyJoinRequestField = 142;

                userPartyJoinResponseField userPartyJoinResponseField = 143;

                userPartyMembershipUpdateField userPartyMembershipUpdateField = 145;

                userPartyFacebookInviteField userPartyFacebookInviteField = 146;

                userFriendListUpdateField userFriendListUpdateField = 147;

                userSkinsCreateRequestField userSkinsCreateRequestField = 150;///

                userSkinsCreateResponseField userSkinsCreateResponseField = 151;///

                userSkinsDeleteField userSkinsDeleteField = 152;

                automationRequestUpdateField automationRequestUpdateField = 160;

                actionCountersUpdateField actionCountersUpdateField = 170;

                userAbTestGroupsUpdateField userAbTestGroupsUpdateField = 171;

                userRewardsTokenRequestField userRewardsTokenRequestField = 180;

                userRewardsTokenResponseField userRewardsTokenResponseField = 181;

                userRewardsUpdatesField userRewardsUpdatesField = 182;

                activateRewardLinkRequestField activateRewardLinkRequestField = 183;

                activateRewardLinkResponseField activateRewardLinkResponseField = 184;

                genericVideoAdRewardTokenRequestField genericVideoAdRewardTokenRequestField = 185;

                genericVideoAdRewardTokenResponseField genericVideoAdRewardTokenResponseField = 186;
}
message loginRequestField{
  int32 realm = 1;
  device device = 2;
  tokens tokens = 3;
  string clientIp = 4;
}
message device{
  int32 platform = 1;
  string version = 2;
  uint32 width = 3;
  uint32 height = 4;
}

message loginResponseField {
  tokens tokens = 1;
  int32 currentGameState = 2;
  optional int32 currentGameType = 3;
  optional userParty userParty = 4;
  uint32 latestConfiguration = 5;
  serverInfo serverInfo = 6;
  userInfo userInfo = 7;
  userStats userStats = 8;
  repeated userWallet userWallet = 9;
  repeated userSettings userSettings = 10;
  repeated userBoosts userBoosts = 11;
  repeated userTimedEvents userTimedEvents = 12;
  userGifts userGifts = 13;
  softUpgrade softUpgrade = 14;
  repeated userAbTestGroups userAbTestGroups = 15;
  repeated userActiveQuests userActiveQuests = 16;
  repeated userPotions userPotions = 17;
  string userSessionId = 18;
  optional userLeaguesInfo userLeaguesInfo = 19;
  userSubscriptions userSubscriptions = 20;
  repeated userRewards userRewards = 21;
  repeated string userUnapprovedSkinsIds = 22;
}
message realmUpgradeRequestField{
///
}
message realmUpgradeResponseField{
///
}
message connectRequestField {
///
}
  
message connectResponseField {
///
}
  
message deviceTokenUpdateField {
///
}
  
message disconnectField {
  int32 reason = 1;
///
}
  
message reconnectField {
///
}
  
message noProperResponseField {
///
}

message pingField {
///
}

message pongField {
///
}

message udpHandshakeField {
///
}

message configurationChangeField {
///
}

message serverGoingOfflineField {
///
}

message gameEnterRequestField {
///
}

message gameEnterResponseField {
///
}

message gameJoinedField {
///
}

message gameLobbyEnterRequestField {
///
}

message gameLobbyEnterResponseField {
///
}

message gameLobbyQueueUpdateField {
///
}
 
message gameArenaDirectionVectorField {
///
}

message gameContinueUpdateRequestField {
///
}

message gameContinueUpdateResponseField {
///
}

message gameArenaLeaderboardField {
///
}

message gameArenaStateField {
///
}

message gameOverField {
  int32 gameType = 1;
  int32 reason = 2;
  repeated productUpdates productUpdates = 3;
  repeated xpLevelUpdates xpLevelUpdates = 4;
  userStats userStats = 5;
  gameSessionStats gameSessionStats = 6;
  potionInfo potionInfo = 7;
  leaderboard leaderboard = 8;
}
message productUpdates {
  int32 origin = 1;
  userWalletItem userWalletItem = 2;
  int32 deltaAmount = 3;//not enum
}
message potionInfo {
    newUserPotion newUserPotion = 1;
    bool wouldHaveWonPotion = 2;
}
message leaderboard {
    repeated leaderboardEntries leaderboardEntries = 1;
    uint32 playerPosition = 2;
}
message leaderboardEntries {
    uint32 ownerId = 1;
    uint32 playerPosition = 2;
    string nickname = 3;
}
message newUserPotion {
    int32 slot = 1;
    int32 status = 2;
    uint32 secondsRemaining = 3;
    string productId = 4;
}
message xpLevelUpdates {
  uint32 finalXpForLevel = 1;
  uint32 deltaXp = 2;
  uint32 finalLevel = 3;
  uint32 deltaLevel = 4;
}
message gameSessionStats {
  uint32 massConsumed = 1;
  uint32 timeTotal = 2;
  uint32 timeInLeaderboard = 3;
  uint32 topPosition = 4;
  uint32 finalPosition = 5;
  uint32 longestTimeAlive = 6;
  uint32 finalMass = 7;
  uint32 highestMass = 8;
  uint32 normalCellsEaten = 9;
  uint32 foodEaten = 10;
  uint32 virusesEaten = 11;
  uint32 playersEaten = 12;
}
message gameArenaPartyCellUpdatesField {
///
}

message gameArenaPartyLeaderboardEntriesUpdatesField {
///
}

message gameArenaEventField {
///
}

message gameArenaCurrentSafeAreaField {
///
}

message gameContinueInfoField {
///
}

message gameBattleRoyaleArenaPhaseField {
///
}

message gameSessionHighestMassField {
///
}

message softPurchaseRequestField {
    string purchaseId = 1;
///
}

message softPurchaseResponseField {
    int32 result = 1;
    string purchaseId = 2;
    repeated productUpdates productUpdates = 3;
///
}

message appleInappPurchaseRequestField {
    uint64 transactionId = 1;
    string receiptData = 2;
    string purchaseToken = 3;
///
}

message googleInappPurchaseRequestField {
    uint64 transactionId = 1;
    string receiptData = 2;
    string signature = 3;
///
}

message inappPurchaseResponseField {
    int32 result = 1;
    uint64 transactionId = 2;
    repeated productUpdates productUpdates = 3;
///
}

message walletUpdatesField {
    string originPlatform = 1;
    repeated productUpdates productUpdates = 2;
///
}

message purchaseWalletUpdatesField {
    string purchaseId = 1;
    walletUpdates walletUpdates = 2;
///
}
message walletUpdates {
    string originPlatform = 1;
    repeated productUpdates productUpdates = 2;
///
}
message offerBundleRequestField {
///
}

message offerBundleResponseField {
///
}

message subscriptionWalletUpdatesField {
    int32 subscriptionType = 1;
    repeated productUpdates productUpdates = 2;
///
}

message updateUserSettingsRequestField {
    repeated userSettingsUpdates userSettingsUpdates = 1;
///
}
message userSettingsUpdates {
    int32 type = 1;
    int32 key = 2;
    string valueString = 3;
    int32 valueInt32 = 4;//not enum
///
}
message updatedUserSettings {
    int32 type = 1;
    int32 key = 2;
    string valueString = 3;
    int32 valueInt32 = 4;//not enum
///
}
message updateUserSettingsResponseField {
    repeated updatedUserSettings updatedUserSettings = 1;
///
}
message userStatsRequestField {
    string userId = 1;
///
}

message userStatsResponseField {
    string userId = 1;
    userStats userStats = 2;
    uint32 lifetimeTrophies = 3;
    uint32 level = 4;
///
}

message serverToServerGameOverWrapperField {
///
}

message claimGiftsRequestField {
    repeated string giftIds = 1;
///
}

message claimGiftsResponseField {
   productUpdates productUpdates = 1;
///
}

message sendGiftsField {
   repeated string giftIds = 1;
///
}

message consumeRequestsField {
   repeated string requestIds = 1;
///
}

message requestGiftsField {
   repeated string giftIds = 1;
///
}

message facebookInvitationRewardUpdatesField {
   repeated string facebookIdsFrom = 1;
   productUpdates productUpdates = 2;
///
}

message activateTimedEventRequestField {
    string eventId = 1;
///
}

message activateTimedEventResponseField {
    userTimedEvent userTimedEvent = 1;
    repeated productUpdates productUpdates = 2;
///
}
message userTimedEvent {
    string eventId = 1;
    uint32 nextAvailableInSeconds = 2;
///
}
message activateBoostRequestField {
    string productId = 1;
///
}

message activateBoostResponseField {
    userBoostItem userBoostItem = 1;
    repeated productUpdates productUpdates = 2;
///
}
message userBoostItem {
    string productId = 1;
    uint32 expiresInSeconds = 2;
///
}
message activateQuestRequestField {
    string productId = 1;
///
}

message activateQuestResponseField {
    userQuest userQuest = 1;
    repeated productUpdates productUpdates = 2;
///
}
message userQuest {
    int32 gameType = 1;
    string productId = 2;
    string type = 3;
    uint32 goal = 4;
    uint32 expiresInSeconds = 5;
///
}
message userTimedEventUpdatesField {
    userTimedEvents userTimedEvents = 1;
///
}

message activateUserRewardsRequestField {
///
}

message activateUserRewardsResponseField {
///
}

message openPotionForProductRequestField {
    string productId = 1;
///
}

message openPotionForProductResponseField {
    int32 result = 1;
    string productId = 2;
    repeated productUpdates productUpdates = 3;
}

message brewPotionForSlotRequestField {
    int32 slot = 1;
}

message brewPotionForSlotResponseField {
    int32 result = 1;
    repeated userPotions userPotions = 2;
}

message openPotionForSlotRequestField {
    int32 slot = 1;
}

message openPotionForSlotResponseField {
    int32 openPotionForSlotResponseField = 1;
    repeated productUpdates productUpdates = 2;
    repeated userPotions userPotions = 3;
}

message userLeaguesInfoRequestField {
///
}

message userLeaguesInfoResponseField {
///
}

message userLeaguesPassUpdateField {
///
}

message userPartyCreateResponseField {
///
}

message userPartyJoinRequestField {
///
}

message userPartyJoinResponseField {
///
}

message userPartyMembershipUpdateField {
///
}

message userPartyFacebookInviteField {
///
}

message userFriendListUpdateField {
///
}

message userSkinsCreateRequestField {
    string content = 1;
    string meta = 2;
///
}

message userSkinsCreateResponseField {
  int32 result = 1;
  repeated productUpdates productUpdates = 2;
///
}

message userSkinsDeleteField {
///
}

message automationRequestUpdateField {
///
}

message actionCountersUpdateField {
  uint32 questsCompleted = 1;
  uint32 potionsObtained = 2;
  uint32 skinsCreated = 3;
///
}

message userAbTestGroupsUpdateField {
///
}

message userRewardsTokenRequestField {
///
}

message userRewardsTokenResponseField {
///
}

message userRewardsUpdatesField {
///
}

message activateRewardLinkRequestField {
///
}

message activateRewardLinkResponseField {
///
}

message genericVideoAdRewardTokenRequestField {
///
}

message genericVideoAdRewardTokenResponseField {
///
}

message tokens{
  string auth = 1;
  string alt = 2;
  string gdpr = 3;
  string xsolla = 4;
}
message userParty{
  string code = 1;
  uint32 endsInSeconds = 2;
  repeated members members = 3;
}
message members{
  string displayName = 1;
  realmInfo realmInfo = 2;
  optional string userId = 3;
}
message realmInfo{
  int32 realm = 1;
  string realmId = 2;
  string avatarUrl = 3;
}
message serverInfo{
  string host = 1;
  uint32 tcpPort = 2;
  uint32 udpPort = 3;
  string awsRegion = 4;
}
message userInfo{
  string userId = 1;
  string displayName = 2;
  uint32 xp = 3;
  uint32 level = 4;
  bool isPayingUser = 5;
  bool hasLoggedIntoMobile = 6;
  bool isNewUser = 7;
  realmInfo realmInfo = 8;
  uint32 extraInitialMass = 9;
  actionCounters actionCounters = 10;
  string latestCountryCode = 11;
  uint32 accountAge = 12;
}
message actionCounters{
  uint32 questsCompleted = 1;
  uint32 potionsObtained = 2;
  uint32 skinsCreated = 3;
}
message userStats{
  uint32 gamesPlayed = 1;
  uint64 massConsumed = 2;
  uint64 allTimeScore = 3;
  uint32 highestMass = 4;
  uint32 longestTimeAlive = 5;
  uint32 mostCellsEaten = 6;
}
message userWallet{
  int32 type = 1;
  string productId = 2;
  uint32 amount = 3;
}
message userSettings{
  int32 type = 1;
  int32 key = 2;
  optional string valueString = 3;
  optional int32 valueInt32 = 4;
}
message userBoosts{
  string productId = 1;
  uint32 expiresInSeconds = 2;
}
message userTimedEvents{
  string eventId = 1;
  uint32 nextAvailableInSeconds = 2;
}
message userGifts{
  repeated claimable claimable = 1;
  repeated string claimedFrom = 2;
  repeated string sentTo = 3;
  repeated string requestedTo = 4;
  repeated string requestedFrom = 5;
}
message claimable{
  string facebookIdFrom = 1;
  userWalletItem userWalletItem = 2;
}
message userWalletItem{
  int32 type = 1;
  string productId = 2;
  uint32 amount = 3;
}
message softUpgrade{
  bool isAvailable = 1;
  bool rewardWasHandedOut = 2;
}
message userAbTestGroups{
  string testId = 1;
  string testGroup = 2;
}
message userActiveQuests{
  int32 gameType = 1;
  string productId = 2;
  string type = 3;
  uint32 goal = 4;
  uint32 expiresInSeconds = 5;
}
message userPotions{
  int32 slot = 1;
  int32 status = 2;
  uint32 secondsRemaining = 3;
  string productId = 4;
}
message userLeaguesInfo{
  uint32 secondsUntilReset = 1;
}
message userSubscriptions{
  repeated int32 active = 1;
}
message userRewards{
  int32 __for = 1;
  uint32 activeSlot = 2;
  repeated userWalletItem userWalletItems = 3;
}
`;

var root = protobuf.parse(proto, { keepCase: true }).root;
var AwesomeMessage = root.lookupType("Data");


  //var buffer = AwesomeMessage.encode(message).finish();
  //console.log(`buffer `,buffer);
  function decodeMobileData(data){
        return AwesomeMessage.decode(data)//ag))
  }
