$(document).ready(function() {
  $("#failedSearch").hide();
  $("#saveSuccess").hide();
  let Game = {};
  const userInput = () => {
    //gets platform value
    let platform = $("input[name='platform']:checked").val();
    //gets genre value
    let genre = $("input[name='genre']:checked").val();
    //gets all tag values
    let tags = $("input[name='tags']:checked")
      .map(function() {
        return $(this).val();
      })
      .get();
    //combines for search query
    //TODO ADD CASE FOR UNSELECTED PROMPTS
    let searchQuery = `platforms=${platform}&genres=${genre}&tags=${tags}`;
    return `https://api.rawg.io/api/games?${searchQuery}`;
  };
  window.onload = async () => {
    init();
    let lastID = localStorage.getItem("gameID");
    if (lastID) {
      $("#cardCol").append(`<div class="loader"></div>`);
      Game = await getGameData(lastID);
      generateHTML(Game);
    }
  };

  $("#search").on("click", async (event) => {
    event.preventDefault();
    $("#failedSearch").hide();
    console.log(Game);
    init();
    $("#cardCol").append(`<div class="loader"></div>`);
    let queryUrl = userInput();
    console.log("queryUrl", queryUrl);
    try {
      const gameID = await generateRandomGameID(queryUrl);
      console.log("gameID", gameID);
      Game = await getGameData(gameID);
      console.log("*******", Game);
      generateHTML(Game);
    } catch (err) {
      console.log(err);
      $("#failedSearch").show();
    }
  });

  $("#save").on("click", async (event) => {
    event.preventDefault();
    const userData = await $.get("/api/user_data");
    console.log("userData", userData.id);

    saveGame(
      userData.id,
      Game.name,
      Game.id,
      Game.slug,
      Game.metacritic,
      Game.released,
      Game.background_image,
      Game.website,
      Game.description_raw
    );
    $("#saveSuccess").show();
    window.setTimeout(function() {
      $("#saveSuccess")
        .fadeTo(500, 0)
        .slideUp(500, function() {
          $(this).remove();
        });
    }, 2000);
  });

  function saveGame(
    UserId,
    name,
    gameId,
    slug,
    metacritic,
    released,
    background_image,
    website,
    description_raw
  ) {
    try {
      $.post("/api/saveGame", {
        UserId,
        name,
        gameId,
        slug,
        metacritic,
        released,
        background_image,
        website,
        description_raw,
      });
    } catch (err) {
      console.log(err);
    }
  }
});
