"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAadhaarText = void 0;
const parseAadhaarText = (frontText, backText) => {
    const data = {};
    const frontLines = frontText.split('\n').map(l => l.trim()).filter(Boolean);
    const backLines = backText.split('\n').map(l => l.trim()).filter(Boolean);
    // === FRONT ===
    for (const line of frontLines) {
        const cleanLine = line.replace(/[^\w\s\/:]/g, '').trim();
        // Aadhaar Number
        if (!data.aadhaarNumber && /^(\d{4}\s\d{4}\s\d{4}|\d{12})$/.test(cleanLine)) {
            data.aadhaarNumber = cleanLine.replace(/\s/g, '');
            continue;
        }
        // DOB
        if (!data.dob && /(DOB|Date of Birth)/i.test(cleanLine)) {
            const match = cleanLine.match(/\d{2}\/\d{2}\/\d{4}/);
            if (match) {
                data.dob = match[0];
                continue;
            }
        }
        // Gender
        if (!data.gender && /(MALE|FEMALE|TRANSGENDER)/i.test(cleanLine)) {
            const match = cleanLine.match(/MALE|FEMALE|TRANSGENDER/i);
            if (match) {
                data.gender = match[0].toUpperCase();
                continue;
            }
        }
    }
    // === Name Detection (early line, capitalized, not junk) ===
    const possibleName = frontLines.find(line => {
        const clean = line.replace(/[^\w\s]/g, '').trim();
        const isValidName = /^[A-Z][a-z]+(?: [A-Z][a-z]+)+$/.test(clean); // At least two words
        const notNoise = !/(DOB|GOVERNMENT|INDIA|AUTHORITY|MALE|FEMALE|\d{4})/i.test(clean);
        return isValidName && notNoise;
    });
    if (possibleName) {
        data.name = possibleName;
    }
    else {
        // fallback: use first 2-3 word lowercase line and capitalize it
        const altName = frontLines.find(line => /^[a-z]{2,}(?: [a-z]{2,}){1,2}$/.test(line) && !/india|government/i.test(line));
        if (altName) {
            data.name = altName
                .split(' ')
                .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                .join(' ');
        }
    }
    // === BACK ===
    let isAddressSection = false;
    const addressLines = [];
    for (const line of backLines) {
        const cleanLine = line.replace(/[^\w\s,\/\-:]/g, '').trim();
        // Start of address block
        if (/Address:/i.test(cleanLine)) {
            isAddressSection = true;
            continue;
        }
        // Stop if line is clearly not address
        if (isAddressSection && (/^\d{4}\s\d{4}\s\d{4}$/.test(cleanLine) || cleanLine.length < 2)) {
            break;
        }
        // Collect address lines
        if (isAddressSection) {
            addressLines.push(cleanLine);
        }
    }
    if (addressLines.length > 0) {
        data.address = addressLines.join(', ');
    }
    else {
        // fallback — take lines after "Address" till we hit pin/state
        const addrStart = backLines.findIndex(l => /Address:/i.test(l));
        if (addrStart !== -1) {
            const addr = backLines.slice(addrStart + 1, addrStart + 5)
                .filter(l => !/\d{4}\s\d{4}\s\d{4}/.test(l)) // remove aadhaar
                .join(', ');
            data.address = addr;
        }
    }
    return data;
};
exports.parseAadhaarText = parseAadhaarText;
