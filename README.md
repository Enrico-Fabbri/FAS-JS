# Fob Anime Scraper Information

## 'index.js'

    Module that exposes all the submodules.

    Scrapers:
      - animeworld
      - animeitaly
      - animesaturn

  <table>
    <p>Tests made on "one piece":</p>
      <thead>
          <tr>
              <th>Name</th>
              <th colspan="3">Time</th>
          </tr>
          <tr>
              <th>-</th>
              <th>search</th>
              <th>getAnimeEpisodes</th>
              <th>Total</th>
          </tr>
      </thead>
      <tbody>
          <tr>
              <td>AnimeWorld</td>
              <td>~175.0400 ms</td>
              <td>~655.2986 ms</td>
              <td>~830.3470 ms</td>
          </tr>
          <tr>
              <td>AnimeItaly</td>
              <td>~1262.7586 ms</td>
              <td>~117.1933 ms</td>
              <td>~1379.9574 ms</td>
          </tr>
          <tr>
              <td>AnimeSaturn</td>
              <td>~353.1590 ms</td>
              <td>~24555.8575 ms</td>
              <td>~24909.0731 ms</td>
          </tr>
      </tbody>
  </table>

## 'animeworld.js'

```javascript
// Example Usage:

const keywords = "one piece";

function f(min, max, currentProgress) {
  console.log(`${min} - ${currentProgress} -> ${max}`);
}

animeworld.search(keywords)
  .then((animeList) => {
    const firstAnime = animeList[0];
    return animeworld.getAnimeEpisodes(firstAnime.mainPageLink, f);
  })
  .then((episodes) => {
    const firstEpisode = episodes[0];
    return animeworld.getVideoLink(firstEpisode.videoID);
  })
  .then((link){
    animeworld.playVideo(link);
  })
  .catch((error) => {
    console.error(error.message);
  });
```

    Search Results (animeList):
    [
      { name: 'One Piece', mainPageLink: '/play/one-piece-subita.qzG-LE' },
      {
        name: 'One Piece (ITA)',
        mainPageLink: '/play/one-piece-ita.d5nahE'
      },
      // ... (other entries)
    ]

    Anime Episodes (episodes):
    [
      { number: 1, videoID: 'HPKmX1' },
      { number: 2, videoID: 'eLqrqP' },
      // ... (other entries)
    ]

## 'animeitaly.js'

```javascript
// Example Usage:

const keywords = "one piece";

function f(min, max, currentProgress) {
  console.log(`${min} - ${currentProgress} -> ${max}`);
}

animeitaly.search(keywords)
  .then((animeList) => {
    const firstAnime = animeList[0];
    return animeitaly.getAnimeEpisodes(firstAnime.mainPageLink, f);
  })
  .then((episodes) => {
    const firstEpisode = episodes[0];
    return animeitaly.getVideoLink(firstEpisode.videoID);
  })
  .then((link){
    animeitaly.playVideo(link);
  })
  .catch((error) => {
    console.error(error.message);
  });
```

    Search Results (animeList):
    [
      { name: 'One Piece ITA', mainPageLink: '/one-piece-ita/' },
      { name: 'One Piece Red ITA', mainPageLink: '/one-piece-red-ita/' },
      // ... (other entries)
    ]

    Anime Episodes (episodes):
    [
      { number: 1, videoID: 'vgxoQzJM2rT4vXg' },
      { number: 2, videoID: '26jdozvKMbuZ0ZB' },
      // ... (other entries)
    ]

## 'animesaturn.js'

```javascript
// Example Usage:

const keywords = "one piece";

function f(min, max, currentProgress) {
  console.log(`${min} - ${currentProgress} -> ${max}`);
}

animesaturn.search(keywords)
  .then((animeList) => {
    const firstAnime = animeList[0];
    return animesaturn.getAnimeEpisodes(firstAnime.mainPageLink, f);
  })
  .then((episodes) => {
    const firstEpisode = episodes[0];
    return animesaturn.getVideoLink(firstEpisode.videoID);
  })
  .then((link){
    animesaturn.playVideo(link);
  })
  .catch((error) => {
    console.error(error.message);
  });
```

    Search Results (animeList):
    [
      { name: 'One Piece', mainPageLink: '/anime/One-Piece-aaaaaaaaaaaaa' },
      {
        name: 'One Piece (ITA)',
        mainPageLink: '/anime/One-Piece-ITA-aaaaaaaaaaaaa'
      },
      // ... (other entries)
    ]

    Anime Episodes (episodes):
    [
      { number: 1, videoID: 'nqCSL_3n6y8nr' },
      { number: 2, videoID: '6vso7vSFrOHgk' },
      // ... (other entries)
    ]
