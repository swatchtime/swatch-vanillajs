# Swatch Internet Time: Vanilla JS PWA

version 0.1.0 

A plain vanilla Javascript PWA app to display the current Swatch Internet Time. This is the "no frills" version that just displays the current .beat time with no additional features. 

## Screenshot

<img src="https://kendawson.online/img/swatch-time.jpg" width="500">

## About

This version does have a service-worker and manifest and can be installed locally as a PWA (on supported devices). The primary Javascript function for generating the Swatch Internet Time is as follows:

```
function getSwatchTime() {

    // Create a Date object for local time
    const d = new Date();

    // Extract local hour, minute and seconds
    const h = d.getHours();       // 0-23
    const m = d.getMinutes();     // 0-59
    const s = d.getSeconds();     // 0-59

    // Timezone offset: convert local to BMT (Biel Mean Time, UTC+1)
    const tzoff = 60 + d.getTimezoneOffset();

    // The magic happens here (see below)
    const beats = ('000' + Math.floor((h * 3600 + (m + tzoff) * 60 + s) / 86.4) % 1000).slice(-3);

    // Return string with current Swatch time (e.g. @042)
    return `@${beats}`;
}
```

The magic explained:

```
const beats = ('000' + Math.floor((h * 3600 + (m + tzoff) * 60 + s) / 86.4) % 1000).slice(-3);
```

 - h * 3600 => seconds contributed by hours
 - (m + tzoff) * 60 => minutes (plus timezone adjustment) converted to seconds
 - \+ s => add seconds
 - Divide by 86.4 to convert seconds to Swatch beats (86400 seconds/day => 1000 beats)
 - Math.floor(...) gives the integer beat number
 - `% 1000` ensures the beat wraps into the 0-999 range
 - .slice(-3) pads the number with leading zeros to always produce 3 digits

### Links:

- About Swatch Internet Time: https://www.swatch.com/en-us/internet-time.html 
- Online example: https://kendawson.online/free/swatch/
