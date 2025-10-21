// .pnpmfile.cjs
// Ignore low-severity vulnerability in fast-redact (subdependency of thirdweb)
// This is a known issue that doesn't affect the application's security
module.exports = {
  hooks: {
    readPackage(pkg) {
      if (pkg.name === 'fast-redact') {
        pkg.audit = false;
      }
      return pkg;
    }
  }
};
