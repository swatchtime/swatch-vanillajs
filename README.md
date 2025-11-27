# Swatch Internet Time: Vanilla JS PWA

version 0.1.0 

A plain vanilla Javascript PWA app to display the current Swatch Internet Time. This is the "no frills" version which just displays the current .beat time with no additional features. 

## Screenshot

<img src="https://kendawson.online/img/swatch-time.jpg" width="441">

Online example: https://kendawson.online/free/swatch/

## About

This version has a service-worker and manifest and can be installed locally as a PWA (on supported devices). 

The primary Javascript function for generating the Swatch Internet Time is as follows:

```
function getSwatchTime() {
    const d = new Date();

    // Seconds since UTC midnight
    const utcSeconds = d.getUTCHours() * 3600 + d.getUTCMinutes() * 60 + d.getUTCSeconds();

    // Convert to Biel time (UTC+1, no DST) and wrap to 0-86399
    const bielSeconds = (utcSeconds + 3600 + 24 * 3600) % (24 * 3600);

    // 1 beat = 86.4 seconds, keep result in 0-999 and pad
    const beats = String(Math.floor(bielSeconds / 86.4) % 1000).padStart(3, '0');

    // Return string with current Swatch time (e.g. @042)
    return `@${beats}`;
}
```

The magic explained:

```
const beats = String(Math.floor(bielSeconds / 86.4) % 1000).padStart(3, '0');
```

 - `bielSeconds` is the number of seconds since midnight in Biel time (UTC+1, no DST), computed from UTC time.
 - Divide by 86.4 to convert seconds to Swatch beats (86400 seconds/day => 1000 beats).
 - `Math.floor(...)` gives the integer beat number.
 - `% 1000` ensures the beat wraps into the 0-999 range.
 - `.padStart(3, '0')` pads the number with leading zeros to always produce 3 digits.

### Links:

- About Swatch Internet Time: https://www.swatch.com/en-us/internet-time.html 
- Github: https://github.com/swatchtime
