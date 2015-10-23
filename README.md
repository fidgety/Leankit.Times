# LeanKit Size Times
A node app to plot your team's ticket time to leankit size.

The config file (found at /config/index.js) is laid out as such:
```
{
    accountName: "myAccount",
    email: "me@example.com",
    password: "password12",
    boardId: "12345678",
    fromLane: "Development: WIP",
    toLane: "Release: Live",
    cardTypes: ["Feature", "Tech Task", "Tech Debt", "Defect"]
}
```

## Account and Board
This section:
```
    accountName: "myAccount",
    email: "me@example.com",
    password: "password12",
    boardId: "12345678"
```
pertains to your account and board and is pretty self explanitory

## Lanes
The entries:
```
    fromLane: "Development: WIP",
    toLane: "Release: Live"
```
represent the start (from) and end (to) lanes for where on your board you want tracking to start and end. They're composed of lane group headers separated with colons. For example, if my board layout has a section called 'Development' containing two lanes 'WIP' and 'Done' and I want tracking to start when the ticket enters the WIP column it would be (as above) 'Development: WIP'. These are case sensitive.

The system is configured to detect the first time the ticket entered the start lane and the last time it entered the end lane (taking a pessimistic view) but that should be easy to change if you need to.

## Card Types
The card type section:
```
    cardTypes: ["Feature", "Tech Task", "Tech Debt", "Defect"]
```
allows you to filter which card types you care about. Leaving this blank will not fetch any tickets, examples of what you can use are in the list of card types from which you can select when creating a new card in leankit. They usually affect the colour of the card.

## 30 second delay
Lastly I just wanted to point out the huge timeout in one of the middlewares. This is to give the leankit api time to respond, it could do with tidying up but each time I've tried to do it something has gone wrong. I'm happy to accept pull requests if you can come up with a better way.