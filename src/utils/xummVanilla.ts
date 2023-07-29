import storage from "./storage"

export const parseJwt = (token: string) => {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString("utf8"));
  } catch (e) {
    console.log('error parsing jwt', e)
    return null;
  }
}

const setXummJwt = (jwt: string) => {
  storage.set('jwt', jwt);
}

const getXummJwt = () =>
  storage.getString('jwt');

const isJwtValid = () => {
  console.log('checking jwt', storage);
  const jwt = storage.getString('jwt');
  console.log({ jwt });
  // expired?
  if (jwt) {
    const parsed = parseJwt(jwt);
    console.log({ parsed });
    if (parsed.exp * 1000 > Date.now()) {
      return true;
    }
  }
  return false;
}

export { setXummJwt, getXummJwt, isJwtValid };