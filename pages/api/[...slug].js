// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Cors from "cors"
import servicesJson from "../../data/services.json"
import {isValidPath, getNetworkFromPath}  from "../../helpers/paths"
import {filterOptInServices} from "../../helpers/services"
import {pipe} from "../../helpers/pipe"
import {SUPPORTED_VERSIONS} from "../../helpers/constants"
import {isGreaterThanOrEqualToVersion} from "../../helpers/version"

// Initializing the cors middleware
const cors = Cors({
  methods: ["POST"]
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

const shouldFilterOrReturnDefault = (filterFn, fact, original) => fact ? filterFn() : original

export default async function handler(req, res) {
  await runMiddleware(req, res, cors)
  
  const {slug} = req.query
  const {fclVersion, include} = req.body
  const isValid = isValidPath(slug)
  const network = getNetworkFromPath(slug)
  const isFilteringSupported = isGreaterThanOrEqualToVersion(fclVersion, SUPPORTED_VERSIONS.FILTERING)

  if (!isValid) {
    return res.status(400).json({message: "Invalid Network"})
  }

  const services = pipe(
    s => shouldFilterOrReturnDefault(() => filterOptInServices(s, include), isFilteringSupported, s)
  )(servicesJson[network])


  return res.status(200).json(services)
}