import { client, xml } from '@xmpp/client'
import debug from '@xmpp/debug'
import 'dotenv/config'

const xmpp = client({
  service: 'yax.im',
  domain: 'yax.im',
  resource: 'example',
  username: process.env.XMPP_BOT_USERNAME,
  password: process.env.XMPP_BOT_PASSWORD
})

debug(xmpp, true)

xmpp.on('error', (err) => {
  console.error(err)
})

xmpp.on('offline', () => {
  console.log('offline')
})

xmpp.on('stanza', onStanza)
async function onStanza (stanza) {
  if (stanza.is('message')) {
    xmpp.removeListener('stanza', onStanza)
    await xmpp.send(xml('presence', { type: 'unavailable' }))
    await xmpp.stop()
  }
}

xmpp.on('online', async (address) => {
  console.log('online as', address.toString())

  // Makes itself available
  await xmpp.send(xml('presence'))

  const message = xml(
    'message',
    { type: 'chat', to: process.env.XMPP_TARGET },
    xml('body', {}, 'yello world')
  )
  await xmpp.send(message)
})

await xmpp.start()
