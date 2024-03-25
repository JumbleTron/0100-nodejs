import { parse } from 'url';
import DefaultController from './controllers/DefaultController.js';

export default async function useRouter(req, res) {
  const parsedUrl = parse(req.url, true);
  const pathSegments = parsedUrl.pathname.split('/').filter((segment) => segment !== '');
  const controllerName = getControllerNameFromRequest(pathSegments);
  //@todo verify if give controller file exist and add some validation for pathSegments string
  const controllerFile = await import(`./controllers/${controllerName}.js`);
  const controller = new controllerFile.default(req, res);
  let actionName = 'index';

  const lastPathElement = pathSegments.pop();
  const objectId = parseInt(lastPathElement);
  const method = req.method;

  if (method === 'GET' && objectId > 0) {
    actionName = 'entity';
  }

  if (typeof controller[actionName] !== 'function') {
    const defaultController = new DefaultController(req, res);
    defaultController.index();
    return;
  }

  //@todo add create new item and edit item rules

  controller[actionName](objectId);
}

const getControllerNameFromRequest = (pathSegments) => {
  if (pathSegments.length > 0) {
    return pathSegments[0][0].toUpperCase() + pathSegments[0].slice(1) + 'Controller';
  }

  return 'DefaultController';
};

const uppercaseWords = (str) => str.replace(/^(.)|\s+(.)/g, (c) => c.toUpperCase());
