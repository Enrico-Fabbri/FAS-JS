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
              <th colspan="4">Time</th>
          </tr>
          <tr>
              <th>-</th>
              <th>search</th>
              <th>getAnimeInfo</th>
              <th>getAnimeEpisodes</th>
              <th>Total</th>
          </tr>
      </thead>
      <tbody>
          <tr>
              <td>AnimeWorld</td>
              <td>~160.2179 ms</td>
              <td>~585.5316 ms</td>
              <td>~603.6827 ms</td>
              <td>~1368.6448 ms</td>
          </tr>
          <tr>
              <td>AnimeItaly</td>
              <td>~1097.9673 ms</td>
              <td>~649.9082</td>
              <td>~616.5255 ms</td>
              <td>~2394.8871 ms</td>
          </tr>
          <tr>
              <td>AnimeSaturn</td>
              <td>~280.1858 ms</td>
              <td>~464.4078 ms</td>
              <td>~24438.0334 ms</td>
              <td>~25145.6578 ms</td>
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
    return { info: animeworld.getAnimeInfo(firstAnime.mainPageLink), episodes: animeworld.getAnimeEpisodes(firstAnime.mainPageLink) };
  })
  .then((anime) => {
    const firstEpisode = anime.episodes[0];
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
    return { info: animeitaly.getAnimeInfo(firstAnime.mainPageLink), episodes: animeitaly.getAnimeEpisodes(firstAnime.mainPageLink) };
  })
  .then((anime) => {
    const firstEpisode = anime.episodes[0];
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

const keywords = "frieren";

function f(min, max, currentProgress) {
    console.log(`${min} - ${currentProgress} -> ${max}`);
}

animesaturn.search(keywords)
  .then((animeList) => {
    const firstAnime = animeList[0];
    return { info: animesaturn.getAnimeInfo(firstAnime.mainPageLink), episodes: animesaturn.getAnimeEpisodes(firstAnime.mainPageLink) };
  })
  .then((anime) => {
    const firstEpisode = anime.episodes[0];
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

# DISCLAIMER

The FAS library is provided "as is," without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and non-infringement. In no event shall the authors or copyright holders be liable for any claim, damages, or other liability, whether in an action of contract, tort, or otherwise, arising from, out of, or in connection with the FAS library or the use or other dealings in the FAS library.

FAS does not claim ownership of any names, libraries, copyrighted material, or brand names accessed or used by the FAS library.
