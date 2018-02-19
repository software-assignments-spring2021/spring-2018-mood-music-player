# Smoodify
### a music streaming application

## Description
Smoodify is a music streaming application that dynamically understands the user's mood and generates a playlist based on it. It relies on lyrical and music analysis to crossreference songs against the user's mood and aims to know what the user is feeling with every skip or listen.

The goal is to have a service that feels like a friend. If you’re feeling down, Smoodify will be a shoulder to lean on. If you’re down to clown, Smoodify will vibe with you. If you’re at the gym and need a push, Smoodify will be there to get you hyped up. The music changes concurrently with the user’s mood as the service matches songs the user already knows and loves with how they are currently feeling. Already feeling better after listening to acoustic songwriter music for 45 minutes? “Smoodify” detects this shift based on the songs you skip and recalibrates.


## Motivation
We found that there is something missing in the music streaming business: a truly personalized way of listening to music. Many services have tried to tackle this problem by adding features such as mood stations or a “radio” mode for discovering new music. However, none of these options are dynamically changing along with the user’s mood. Our product aims to solve this problem. The primary motivation for creating this application was to provide an easier way for music listeners to queue up songs based on their current moods. 

## How It Works
The user would make an account on the app using their already existing Spotify account (either using their email or Facebook login). Once logged in, they can look at their music and already existing playlists, and they can play music either by choosing a song or using the "shuffle" feature. Once the music is playing, the app is now "listening" for clues. If a user skips a song, that means they are not feeling like listening to it, and if a user listens through more than 50% of the song, that means the opposite. Based on this information, the app figures out the user's mood and recalibrates with every skip. The app also gives the user the option of saving the session as a playlist on the app to listen to at a later time. 

## Technical Details
Smoodify is a web application built on Node using Express. It makes use of the following APIs and modules:
* [node-spotify-web](https://github.com/TooTallNate/node-spotify-web) to stream songs
* [spotify-web-api-node](https://github.com/thelinmichael/spotify-web-api-node) to analyze songs' metadata
* [musixmatch API](https://developer.musixmatch.com) to retrieve song lyrics
* [sentiment](https://www.npmjs.com/package/sentiment) to analyze sentiment in lyrics
* [Gracenote Developer](https://developer.gracenote.com) to analyze music

## [Contributing](CONTRIBUTING.md)

## Contributors
1. [Olina Stathopoulou](https://github.com/olinastath) :sparkles:
2. [Ryan Chau](https://github.com/rchau0623) 
3. [Peter Kim](https://github.com/peterckim) 
4. [Andrea Waxman](https://github.com/andreawaxman) 

## Requirements
All requirements for building the app are included in the `package.json` file and can be installed by simply navigating to the app's directory and running `npm install`.

## Building & Testing
Information on building and testing the application will be posted once the app is fully functioning.

## Other Notes
Smoodify relies on the Spofity SDK to stream songs. To experience our application's full extent, please log in with a Spotify Premium account.