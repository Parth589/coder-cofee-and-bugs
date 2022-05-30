import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";

const PlayerSpeed = 620;
let BSPEED = 420;
let GAMEOVER = false;
const BUGSCALE = .09;
let isPlaying = false;
var music;
kaboom({
    font: "sink",
    background: [210, 210, 155,],
});
loadSprite("player", "sprites/player.jpg");
loadSprite("coffee", "sprites/coffee.jpg");
loadSprite("bug", "sprites/bug.png");
loadSprite("replay", "sprites/retry.png");

loadSound("bgMusic", "sound/bgMusic.mpga");
loadSound("gameOver", "sound/gameOver.mpga");
loadSound("sip", "sound/sip.mpga");

const player = add([
    sprite("player"),
    scale(.07),
    area(),
    solid(),
    pos(450, 23),
    "player"
]);
const score = add([
    text("Score: 0"),
    pos(24, 24),
    scale(3),
    { value: 0 },
]);


let id = setInterval(() => {
    if (!GAMEOVER) {
        for (let i = 0; i < 3; i++) {
            let x = rand(0, width());
            let y = height();

            let c = add([
                sprite("bug"),
                pos(x, y),
                area(),
                scale(BUGSCALE),
                "bug"
            ]);
            c.onUpdate(() => {
                // ! For God Modders
                // if (randi(0, 2))
                //     c.move(0 + BSPEED / 5, - BSPEED);
                // else
                //     c.move(0 - BSPEED / 5, - BSPEED);
                c.move(0, - BSPEED);
            });
        }

        let x = rand(0, width());
        let y = height();

        // Lets introduce a coffee for our programmer to drink
        let c = add([
            sprite("coffee"),
            pos(x, y),
            area(),
            scale(0.03),
            "coffee"
        ]);
        c.onUpdate(() => {
            c.move(0, - BSPEED);
        });
    }
}, 1500);



onKeyDown(["up", "w"], () => {
    player.move(0, -PlayerSpeed);
    startBgMusic();
});
onKeyDown(["down", "s"], () => {
    player.move(0, PlayerSpeed);
    startBgMusic();
});
onKeyDown(["right", "d"], () => {
    player.move(PlayerSpeed, 0);
    startBgMusic();
});
onKeyDown(["left", "a"], () => {
    player.move(-PlayerSpeed, 0);
    startBgMusic();
});
onCollide("player", "bug", () => {
    destroy(player);
    addKaboom(player.pos);
    clearInterval(id);
    const sipMusic = play("gameOver", {
        volume: 2,
        loop: false
    });
    sipMusic.play();
    setTimeout(() => {
        destroyAll("coffee");
        destroyAll("bug");
        pauseBgMusic();

        const replay = add([
            sprite("replay"),
            scale(.7),
            area(),
            pos(width() / 2 - 250, height() / 2),
            "replay"
        ]);
        onClick("replay", () => {
            console.log("Event listned!!"); location.reload();
        });
    }, 1000);
});
onCollide("player", "coffee", (player, coffee) => {
    destroy(coffee);
    music.volume(.3);
    setTimeout(() => {
        const sipMusic = play("sip", {
            volume: 2,
            loop: false
        });
        sipMusic.play();
        setTimeout(() => {
            music.volume(.8);
        }, 300);
    }, 300);
    player;
    score.value += 1;
    score.text = "Score:" + score.value;
});

onCollide("bug", "coffee", (bug) => {
    destroy(bug);
    let x = rand(0, width());
    let y = height();

    let c = add([
        sprite("bug"),
        pos(x, y),
        area(),
        scale(BUGSCALE),
        "bug"
    ]);
    c.onUpdate(() => {
        // ! For God Modders
        // if (randi(0, 2))
        //     c.move(0 + BSPEED / 5, - BSPEED);
        // else
        //     c.move(0 - BSPEED / 5, - BSPEED);
        c.move(0, - BSPEED);
    });
});

function startBgMusic() {
    if (isPlaying === false) {
        music = play("bgMusic", {
            volume: 0.8,
            loop: true
        });
        music.play();
        isPlaying = true;
    }
}
function pauseBgMusic() {
    if (isPlaying === true) {
        music.pause();
        isPlaying = false;
    }
}