const IPv4MappedValidate = /^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/;

module.exports = {
    /**
     * @param {string} a
     */
    filterIPAddress(a) {
        const unmapped = IPv4MappedValidate.exec(a);
        return unmapped ? unmapped[1] : a;
    },

    version: "1.3.6"
};
