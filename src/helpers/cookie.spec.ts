import Cookie from './cookie';

describe('cookie helper', () => {
  const name = "test";
  let value = "test";

  describe('getCookieValue', () => {

    it ("should return undefined if the cookie isn't set", () => {
      clearCookies();
      setCookie('random', 'random');
      expect(Cookie.getCookieValue(name)).toBeUndefined();
    });

    it ('should return the value of the cookie', () => {
      value = "test";
      setCookie(name, value);
      expect(Cookie.getCookieValue(name)).toEqual(value);
    });
  });

  describe('removeCookie', () => {
    it("should remove a given cookie", () => {
      setCookie('test1', 'test1');
      Cookie.removeCookie('test1');

      expect(Cookie.getCookieValue('test1')).toBeUndefined();
    });
  })
});

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}`;
}

function clearCookies() {
  document.cookie = document.cookie.split(";").reduce(function (acc, cookie) {
    const eqPos = cookie.indexOf("=");
    const cleanCookie = `${cookie.substr(0, eqPos)}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
    return `${acc}${cleanCookie}`;
  }, "");
}
