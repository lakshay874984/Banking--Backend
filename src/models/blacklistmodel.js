const mongoose =  require("mongoose")

const tokenBlacklistSchema = new mongoose.Schema({
    token:{
        type:String,
        required:[true,"Token is requires to blacklist"],
        unique:[true,"Token is already blacklisted"]
    }
},{timestamps:true})

tokenBlacklistSchema.index({
    createdAt:1
},{
    expireAfterSeconds:60*60*24*3 //3 daays
}) // this is a ttl
/*
TTL means
Time To Live
Instead of making searches faster, this special index automatically deletes documents after a specified amount of time.
Think of it as an automatic cleaner.
*/
/*What does this line mean?
tokenBlacklistSchema.index({
    createdAt: 1
});

This says

Create an index on the createdAt field.

The 1 means

Ascending Order

Example

10:00
10:05
10:10
10:20

Descending would be

createdAt: -1
10:20
10:10
10:05
10:00

For a TTL index, the order (1 or -1) doesn't really matter. MongoDB requires the index to be on a date field, and 1 is the standard choice.

Why createdAt?

Because timestamps automatically creates

{
    createdAt,
    updatedAt
}

Suppose you save
{
    token:"ABC123",
    createdAt:"15 July 2026 10:00 AM"
}
MongoDB remembers the creation time.
expireAfterSeconds
expireAfterSeconds:60*60*24*3
 


Example Timeline

Suppose

User logs out

15 July 10:00 AM

Document

{
    "token":"ABC123",
    "createdAt":"15 July 10:00"
}

Now MongoDB keeps checking.

16 July

↓

Age = 1 day

↓

Keep it
17 July

↓

Age = 2 days

↓

Keep it
18 July

↓

Age = 3 days

↓

Delete it automatically

You never call

deleteOne()

MongoDB removes it.
 */

const tokenBlacklistModel = mongoose.model("tokenBlackList",tokenBlacklistSchema)

module.exports = tokenBlacklistModel