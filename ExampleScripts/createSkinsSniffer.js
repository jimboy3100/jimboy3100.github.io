(function() {
    // --- 1. Helper: Write Protocol Buffer Varint ---
    function writeVarint(value) {
        let bytes = [];
        while (value > 127) {
            bytes.push((value & 127) | 128);
            value >>>= 7;
        }
        bytes.push(value);
        return bytes;
    }

    // --- 2. Helper: Extract Footer (Name/Price) from your previous sniff ---
    // We look for the PNG "IEND" marker to find where the image ends and metadata begins.
    function extractFooter(fullSavedImage) {
        if (!fullSavedImage) return null;
        // Search for "IEND" (Decimal: 73, 69, 78, 68)
        for (let i = 0; i < fullSavedImage.length - 8; i++) {
            if (fullSavedImage[i]===73 && fullSavedImage[i+1]===69 && fullSavedImage[i+2]===78 && fullSavedImage[i+3]===68) {
                // Found IEND. The footer starts 8 bytes later (4 bytes 'IEND' + 4 bytes CRC)
                return fullSavedImage.slice(i + 8);
            }
        }
        console.warn("Could not auto-detect PNG footer. Using empty footer.");
        return new Uint8Array([]);
    }

    // Attempt to get footer from the data you just sniffed
    const SAVED_FOOTER = extractFooter(window.SAVED_IMAGE);
    if (SAVED_FOOTER) {
        console.log(`[LM Uploader] Metadata Footer extracted! (${SAVED_FOOTER.length} bytes). Contains Name/Price.`);
    } else {
        console.error("[LM Uploader] Warning: No sniffed data found. Please run the Sniffer step first!");
    }

    // --- 3. The Main Upload Function ---
    window.uploadCustomSkin = function(newImageUint8Array) {
        if (!window.core || !window.core.proxyMobileData) return console.error("Legend Mod not found");
        
        console.log("Constructing Skin Packet...");

        // A. Calculate Sizes
        const imageLen = newImageUint8Array.length;
        const footerLen = SAVED_FOOTER.length;
        
        // Size of the Skin Object (Image Tag + Image Len + Image Data + Footer)
        // Tag '10' (Field 1) is 1 byte. Varint length is dynamic.
        const imageLenVarint = writeVarint(imageLen);
        const skinObjContentSize = 1 + imageLenVarint.length + imageLen + footerLen;
        
        // Size of the Wrapper Payload (Request ID + Field 1202 Tag + Field 1202 Len + Skin Object)
        // Request ID '8, 150, 1' is 3 bytes.
        // Field 1202 Tag '178, 9' is 2 bytes.
        const skinObjLenVarint = writeVarint(skinObjContentSize);
        const payloadSize = 3 + 2 + skinObjLenVarint.length + skinObjContentSize;

        // B. Build the Packet
        let packet = [];

        // 1. Outer Wrapper (Opcode 102/8)
        packet.push(8, 1); 
        packet.push(18); // Field 2 Tag
        packet.push(...writeVarint(payloadSize)); // Wrapper Length

        // 2. Inner Message (Request 150)
        packet.push(8, 150, 1); 

        // 3. Skin Object Wrapper (Field 1202)
        packet.push(178, 9); 
        packet.push(...skinObjLenVarint); // Skin Object Length

        // 4. Image Data (Field 1)
        packet.push(10); // Tag
        packet.push(...imageLenVarint); // Image Length
        
        // Convert array to Uint8Array to merge
        const headerPart = new Uint8Array(packet);
        
        // C. Merge All Parts (Header + New Image + Old Footer)
        const finalBuffer = new Uint8Array(headerPart.length + imageLen + footerLen);
        finalBuffer.set(headerPart, 0);
        finalBuffer.set(newImageUint8Array, headerPart.length);
        finalBuffer.set(SAVED_FOOTER, headerPart.length + imageLen);

        console.log(`[LM Uploader] Sending Packet! Total Size: ${finalBuffer.length} bytes.`);
        
        // D. Send via Legend Mod
        window.core.proxyMobileData(finalBuffer);
    };

    console.log("%c[LM Uploader] Ready! Use window.uploadCustomSkin(uint8Array) to upload.", "color: lime; font-weight: bold;");
})();
