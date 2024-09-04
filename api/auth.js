import { OAuth2Client } from 'google-auth-library'
const client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET)

// Call this function to validate the JWT credential sent from client-side
async function verifyCredentials(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
  })
  const payload = ticket.getPayload()
  return payload
}

// Call this function to validate the payload sent from client-side
async function validateCredentials(payload) {
  const { email, email_verified } = payload
  if (email_verified && email) {
    return true
  }
  return false
}

export async function validate(token){
  try {
    const payload = await verifyCredentials(token)
    return payload
  } catch (error) {
    console.error('Error validating token:', error)
    return false
  }
}

export default async function handler(request, response) {
  if (request.method === 'POST') {
    const body = request.body
    const { credential } = body
    try {
      const payload = await validate(credential)
      if (!payload) {
        return response.status(401).json({ error: 'Invalid token' })
      }
      return response.status(200).json({ message: 'Token is valid' })
    } catch (error) {
      console.error('Error validating token:', error)
      return response.status(500).json({ error: 'Internal server error' })
    }
  } else {
    return response.status(405).json({ error: 'Method not allowed' })
  }
}