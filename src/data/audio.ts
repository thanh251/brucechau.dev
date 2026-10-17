import type { AudioFrequencyResponse } from '~/lib/audio-frequency'

// Smoothed, unequalized response from the AutoEq/oratory1990 IE 900 CSV.
// Samples are reduced for the SVG; values are relative to roughly 1 kHz, not absolute SPL.
const ie900FrequencyResponse = {
  sourceName: 'oratory1990 measurement · AutoEq CSV',
  sourceUrl: 'https://github.com/jaakkopasanen/AutoEq/blob/master/results/oratory1990/in-ear/Sennheiser%20IE%20900/Sennheiser%20IE%20900.csv',
  contextName: 'Headphones.com listening review',
  contextUrl: 'https://headphones.com/blogs/reviews/sennheiser-ie-900-review-this-is-the-bass-ive-been-looking-for',
  points: [
    [20, 8.65], [23, 8.78], [27, 8.70], [32, 8.52], [37, 8.21], [44, 7.76],
    [51, 7.20], [60, 6.52], [71, 5.78], [83, 4.97], [98, 4.10], [115, 3.22],
    [135, 2.32], [158, 1.80], [185, 1.54], [217, 0.78], [255, 0.07],
    [299, -0.35], [351, -0.50], [411, -0.87], [482, -1.16], [566, -1.32],
    [663, -1.35], [778, -1.20], [912, -0.61], [1070, 0.59], [1255, 2.25],
    [1471, 3.57], [1725, 4.16], [2023, 4.05], [2372, 3.32], [2782, 2.13],
    [3262, 0.95], [3825, 0.49], [4485, 1.31], [5260, 4.01], [5696, 4.09],
    [6167, 3.24], [6679, 4.60], [7232, 4.02], [7831, 3.22], [8480, 2.82],
    [9183, 2.29], [9944, 1.75], [10768, 0.69], [11660, -0.61],
    [12626, -2.12], [13672, -3.83], [14805, -5.74], [16032, -7.85],
    [17360, -10.16], [18799, -12.67], [19955.54, -14.69],
  ],
  impressions: {
    subBass: 'The measured level is strongest below 60 Hz. A good seal should give deep rumble and weight to electronic bass and low drums; a loose tip can erase much of it.',
    bass: 'The curve slopes down through mid-bass instead of staying elevated. Expect firm punch and bass-guitar body without the same amount of bloom in the lower mids.',
    lowerMids: 'Around 250 Hz–1 kHz, the response is comparatively restrained. That leaves space between bass and vocals, but can sound a touch lean next to the powerful sub-bass.',
    upperMids: 'Energy rises early around 1.5–2 kHz, then begins to fall. Vocals have some body, but their clarity can feel less forward than on a more conventional upper-mid tuning.',
    presence: 'The dip around 3–4 kHz softens bite and vocal projection. It may feel smooth, though higher voices and guitars can sit farther back in the mix.',
    treble: 'The 5–10 kHz region rises again, adding crisp edges and sparkle. This area varies strongly with ear tips and insertion depth, so the graph is a guide rather than a promise.',
    air: 'The published curve falls from 10 kHz toward 20 kHz. Treat this region cautiously: IEM fit, insertion depth, and measurement setup can change the result substantially, so it cannot reliably predict how much “air” you will hear.',
  },
} satisfies AudioFrequencyResponse

export const audioContent = {
  eyebrow: 'essentials / uses',
  title: 'Audio',
  description: 'Listening gear, with a closer look at how each piece is tuned.',
  items: [
    {
      number: '01',
      name: 'Sennheiser IE 900',
      details: 'Wired in-ear monitors · single dynamic driver',
      note: 'A small, carefully built IEM with a distinctly deep low end.',
      review: {
        summary: 'A measurement-guided look at the IE 900: substantial sub-bass, recessed presence, and lively treble.',
        detail: 'The response shown below is from an independent measurement, not a measurement of this individual pair. Published listening impressions broadly support the strong low end and less-forward 3–4 kHz region. Fit, ear tips, insertion depth, music, and personal hearing can change the result.',
      },
      ratings: { price: 2.0, performance: 4.5, comfortable: 4.4, buildQuality: 4.6, aesthetic: 4.7 },
      ratingReasons: {
        price: 'A premium IEM whose cost is hard to justify on sound quality alone; accessories and finish add some value.',
        performance: 'Strong bass extension and detail, with an upper-mid dip that will not suit every vocal preference.',
        comfortable: 'The small shells and replaceable tips can fit well, though seal and insertion depth matter especially for the bass.',
        buildQuality: 'Machined metal housings and detachable cables feel substantial; connector and cable care still matter.',
        aesthetic: 'The restrained silver shell and fine concentric machining look distinctive without being loud.',
      },
      image: '/uses/sennheiser-ie-900-product.png',
      imageWidth: 600,
      imageHeight: 600,
      imageAlt: 'Silver Sennheiser IE 900 in-ear monitors with detachable cable',
      imageSource: 'https://cdn2.cellphones.com.vn/x/media/catalog/product/t/_/t_i_xu_ng_-_2023-02-07t231118.024.png',
      frequencyResponse: ie900FrequencyResponse,
    },
  ],
} as const
