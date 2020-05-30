export function beautifyCashValue(labelValue) {
  // Nine Zeroes for Billions
  // Math.abs(Number(labelValue)) >= 1.0e+9

  // Six Zeroes for Millions
  return Math.abs(Number(labelValue)) >= 1.0e6
    ? Math.floor(Math.abs(Number(labelValue)) / 1.0e6) + 'M$'
    : // Three Zeroes for Thousands
    Math.abs(Number(labelValue)) >= 1.0e3
    ? Math.floor(Math.abs(Number(labelValue)) / 1.0e3) + 'K$'
    : Math.floor(Math.abs(Number(labelValue)))
}
export function calculateMissingData(movie) {
  let missingFields = []
  // if (!movie.release_date) {
  //   missingFields.push({
  //     attr: 'release_date',
  //     cause: 'missing',
  //     menu: 'Release'
  //   })
  // }
  // if (!movie.length) {
  //   missingFields.push({ attr: 'length', cause: 'missing', menu: 'Script' })
  // }
  // if (!movie.overview) {
  //   missingFields.push({ attr: 'overview', cause: 'missing', menu: '' })
  // }
  // if (!movie.plot_line) {
  //   missingFields.push({ attr: 'plot_line', cause: 'missing', menu: 'Story' })
  // }
  // if (!movie.budget) {
  //   missingFields.push({ attr: 'budget', cause: 'missing', menu: 'Production' })
  // }
  // if (!movie.website) {
  //   missingFields.push({ attr: 'website', cause: 'missing', menu: '' })
  // }
  if (!movie.word_count) {
    missingFields.push({ attr: 'word_count', cause: 'missing', menu: 'Script' })
  }
  if (!movie.most_used_word) {
    missingFields.push({ attr: 'most_used_word', cause: 'missing', menu: '' })
  }
  // if (!movie.revenue) {
  //   missingFields.push({ attr: 'revenue', cause: 'missing', menu: 'General' })
  // }
  // if (!movie.poster || !movie.poster.url) {
  //   missingFields.push({ attr: 'poster', cause: 'missing', menu: 'Release' })
  // } else if (!movie.poster.poster_type_id) {
  //   missingFields.push({
  //     attr: 'poster.poster_type_id',
  //     cause: 'missing',
  //     menu: 'Release'
  //   })
  // }
  // if (!movie.story_origin) {
  //   missingFields.push({
  //     attr: 'story_origin',
  //     cause: 'missing',
  //     menu: 'Story'
  //   })
  // }
  // if (!movie.type) {
  //   missingFields.push({ attr: 'type', cause: 'missing', menu: '' })
  // }
  // if (!movie.genres.length) {
  //   missingFields.push({ attr: 'genres', cause: 'missing', menu: 'Story' })
  // } else {
  //   if (!movie.genres.find(genre => genre.movies_genres.primary)) {
  //     missingFields.push({
  //       attr: 'primary_genre',
  //       cause: 'missing',
  //       menu: 'Story'
  //     })
  //   }
  // }
  // if (!movie.languages.length) {
  //   missingFields.push({ attr: 'languages', cause: 'missing', menu: 'Script' })
  // } else {
  //   if (!movie.languages.find(language => language.movies_languages.primary)) {
  //     missingFields.push({
  //       attr: 'primary_language',
  //       cause: 'missing',
  //       menu: 'Script'
  //     })
  //   }
  // }
  // if (!movie.restrictions.length) {
  //   missingFields.push({
  //     attr: 'restrictions',
  //     cause: 'missing',
  //     menu: 'Release'
  //   })
  // } else {
  //   if (
  //     !movie.restrictions.find(
  //       restriction => restriction.movies_restrictions.primary
  //     )
  //   ) {
  //     missingFields.push({
  //       attr: 'primary_restriction',
  //       cause: 'missing',
  //       menu: 'Release'
  //     })
  //   }
  // }
  if (!movie.characters.length) {
    missingFields.push({ attr: 'characters', cause: 'missing' })
  } else {
    const mainCharacter = movie.characters.find(
      character => character.movies_characters.main
    )
    if (!mainCharacter) {
      missingFields.push({
        attr: 'main_character',
        cause: 'missing',
        menu: 'Story'
      })
    } else {
      // if (!mainCharacter.name) {
      //   missingFields.push({
      //     attr: 'main_character_name',
      //     cause: 'missing',
      //     menu: 'Story'
      //   })
      // }
      if (!mainCharacter.date_of_birth) {
        missingFields.push({
          attr: 'main_character_birth',
          cause: 'missing',
          menu: 'Story'
        })
      }
      if (!mainCharacter.gender) {
        missingFields.push({
          attr: 'main_character_gender',
          cause: 'missing',
          menu: 'Story'
        })
      }
      // if (!mainCharacter.movies_characters.type) {
      //   missingFields.push({
      //     attr: 'main_character_type',
      //     cause: 'missing',
      //     menu: 'Story'
      //   })
      // }
    }
  }

  if (!movie.directors.length) {
    missingFields.push({
      attr: 'directors',
      cause: 'missing',
      menu: 'Production'
    })
  } else {
    const mainDirector = movie.directors.find(
      director => director.movies_directors.primary
    )
    if (!mainDirector) {
      missingFields.push({
        attr: 'main_director',
        cause: 'missing',
        menu: 'Production'
      })
    } else {
      if (!mainDirector.name) {
        missingFields.push({
          attr: 'main_director_name',
          cause: 'missing',
          menu: 'Production'
        })
      }
      if (!mainDirector.date_of_birth) {
        missingFields.push({
          attr: 'main_director_birth',
          cause: 'missing',
          menu: 'Production'
        })
      }
      if (!mainDirector.gender) {
        missingFields.push({
          attr: 'main_director_gender',
          cause: 'missing',
          menu: 'Production'
        })
      }
    }
  }

  return missingFields
}
