const _ = require("lodash");

exports.addCacheHeadersToResult = function addCacheHeadersToResult(
  response,
  cacheKeys,
  cdnProvider = "cloudflare"
) {
  if (cacheKeys) {
    if (cacheKeys === "DO_NOT_CACHE") {
      response.headers["Cache-Control"] =  "private,no-cache,no-store,max-age=0";
      if (cdnProvider === "akamai") {
        response.headers["Edge-Control"] = "private,no-cache,no-store,max-age=0";
      }
      response.headers["Vary"] = "Accept-Encoding";
      response.headers["Surrogate-Control"] = "private,no-cache,no-store,max-age=0";
      return response;
    } else {
      response.headers["Cache-Control"] = "public,max-age=15,s-maxage=300,stale-while-revalidate=1000,stale-if-error=14400";
      if (cdnProvider === "akamai") {
        response.headers["Edge-Control"] = "public,maxage=15,stale-while-revalidate=1000,stale-if-error=14400";
      }
      response.headers["Vary"] = "Accept-Encoding";

      // Cloudflare Headers
      response.headers["Cache-Tag"] = _(cacheKeys).uniq().join(",");

      //Akamai Headers
      if (cdnProvider === "akamai") {
        response.headers["Edge-Cache-Tag"] = _(cacheKeys).uniq().join(",");
      }
      // Fastly Header
      response.headers["Surrogate-Control"] = "public,max-age=15,stale-while-revalidate=300,stale-if-error=14400";
      response.headers["Surrogate-Key"] = _(cacheKeys).uniq().join(" ");
      console.log("in cdn-caching response", response);
      return response;
    }
  } else {
    response.headers["Cache-Control"]="public,max-age=15,s-maxage=300,stale-while-revalidate=150,stale-if-error=3600";
    if (cdnProvider === "akamai") {
      response.headers["Edge-Control"] = "public,maxage=15,stale-while-revalidate=150,stale-if-error=3600";
    }
    response.headers["Vary"] = "Accept-Encoding";
    response.headers["Surrogate-Control"] = "public,max-age=15,s-maxage=300,stale-while-revalidate=150,stale-if-error=3600";
    return response;
  }
};