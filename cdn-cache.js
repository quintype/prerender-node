const _ = require("lodash");

exports.addCacheHeadersToResult = function addCacheHeadersToResult(
  res,
  cacheKeys,
  cdnProvider = "cloudflare"
) {
  if (cacheKeys) {
    if (cacheKeys === "DO_NOT_CACHE") {
      res.headers["Cache-Control"] =  "private,no-cache,no-store,max-age=0";
      if (cdnProvider === "akamai") {
        res.headers["Edge-Control"] = "private,no-cache,no-store,max-age=0";
      }
      res.headers["Vary"] = "Accept-Encoding";
      res.headers["Surrogate-Control"] = "private,no-cache,no-store,max-age=0";
    } else {
      res.headers["Cache-Control"] = "public,max-age=15,s-maxage=300,stale-while-revalidate=1000,stale-if-error=14400";
      if (cdnProvider === "akamai") {
        res.headers["Edge-Control"] =
          "public,maxage=15,stale-while-revalidate=1000,stale-if-error=14400";
      }
      res.headers["Vary"] = "Accept-Encoding";

      // Cloudflare Headers
      res.headers["Cache-Tag"] = _(cacheKeys).uniq().join(",");

      //Akamai Headers
      if (cdnProvider === "akamai") {
        res.headers["Edge-Cache-Tag"] = _(cacheKeys).uniq().join(",");
      }
      // Fastly Header
      res.headers["Surrogate-Control"] =
        "public,max-age=15,stale-while-revalidate=300,stale-if-error=14400";
        res.headers["Surrogate-Key"] = _(cacheKeys).uniq().join(" ");
    }
  } else {
    res.headers["Cache-Control"]="public,max-age=15,s-maxage=300,stale-while-revalidate=150,stale-if-error=3600";
    if (cdnProvider === "akamai") {
      res.headers["Edge-Control"] =
        "public,maxage=15,stale-while-revalidate=150,stale-if-error=3600";
    }
    res.headers["Vary"] = "Accept-Encoding";
    res.headers["Surrogate-Control"] =
      "public,max-age=15,s-maxage=300,stale-while-revalidate=150,stale-if-error=3600";
  }
};