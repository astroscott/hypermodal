const rarepress = new Rarepress();
let account = await rarepress.init({ host: "0x0D259D356CA3251eeaBa784e4A447AD831aB30C5" })
const cid = await rarepress.add("/Users/aaronscott/Desktop/hypermodal/rsc/metadata/HM00000_#DBDF89.gif")
const token = await rarepress.create({
  metadata: {
    name: "BTC",
    description: "A Peer to Peer Store of Value",
    image: "/ipfs/" + cid,
  },
  supply: 21000000,
  royalties: [{
    account: account,
    value: 2000
  }]
})