/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var Bullet = (function () {
    function Bullet(origin, position, vector, angle) {
        this.id = Engine.createUID();
        this.hitbox = {
            width: 10,
            height: 10
        };
        this.speed = 5;
        this.acceleration = 0;
        this.sprite = {
            url: "./sprites/bullet/Bullet.png",
            count: 3,
            size: {
                width: 64,
                height: 16
            },
            currentSprite: 0
        };
        this.health = 1000;
        this.direction = 1;
        this.origin = origin;
        this.position = position;
        this.vector = vector;
        this.angle = angle;
    }
    Bullet.prototype.update = function (context) {
        this.updateSprite();
        Engine.displayEntity(context, this);
    };
    Bullet.prototype.updateSprite = function () {
        if (this.sprite.currentSprite === this.sprite.count - 1)
            return;
        this.sprite.currentSprite = this.sprite.currentSprite + 1;
    };
    return Bullet;
}());

var Children = (function () {
    function Children(position) {
        if (position === void 0) { position = { x: 10, y: 0 }; }
        var _this = this;
        this.id = Engine.createUID();
        this.shootCountdown = 1500;
        this.acceleration = .5;
        this.hitbox = {
            width: 10,
            height: 10
        };
        this.sprite = {
            url: "./sprites/eva/Eva01_run.png",
            count: 23,
            size: {
                width: 10,
                height: 10
            },
            currentSprite: 0
        };
        this.speed = 0;
        this.health = 200;
        this.direction = 1;
        this.states = [];
        this.lastShootTime = 0;
        this.jump = function () {
            if (_this.states.includes('jump'))
                return;
            _this.states = _this.setState('jump');
            var initialY = _this.position.y;
            var currentJumpSprite = 0;
            var jumpInterval = setInterval(function () {
                if (currentJumpSprite < _this.sprite.count) {
                    _this.sprite.currentSprite = currentJumpSprite;
                    _this.position.y = initialY + Children.jumpHeight * Math.sin((Math.PI / _this.sprite.count) * currentJumpSprite);
                    currentJumpSprite++;
                }
                else {
                    clearInterval(jumpInterval);
                    _this.position.y = initialY;
                    _this.states = _this.removeState('jump');
                }
            }, 100);
        };
        this.move = function () {
            _this.position.x +=
                _this.states.includes('crouch')
                    ? (_this.speed / 2) * _this.direction
                    : _this.speed * _this.direction;
            _this.states = _this.setState('run');
        };
        this.crouch = function () {
            _this.sprite = {
                url: "./sprites/eva/Eva01_crouch.png",
                count: 1,
                currentSprite: 0,
                size: {
                    width: 91,
                    height: 53
                }
            };
            _this.hitbox = {
                width: _this.sprite.size.width,
                height: _this.sprite.size.height
            };
            _this.states = _this.setState('crouch');
        };
        this.standUp = function () {
            _this.sprite = {
                url: "./sprites/eva/Eva01_run.png",
                count: 1,
                currentSprite: 0,
                size: {
                    width: 83,
                    height: 73
                }
            };
            _this.states = [];
        };
        this.shoot = function (position) {
            var now = Date.now();
            if (now - _this.lastShootTime < _this.shootCountdown)
                return null;
            _this.lastShootTime = now;
            var angle = Math.atan2(position.y - _this.position.y, position.x - _this.position.x);
            var pos = { x: _this.position.x + _this.sprite.size.width, y: _this.position.y + _this.sprite.size.height };
            var vector = { x: Math.cos(angle) * _this.speed, y: Math.sin(angle) * _this.speed };
            return new Bullet(_this.id, pos, vector, angle);
        };
        this.update = function (context) {
            _this.updateSprite(11, 23);
            Engine.displayEntity(context, _this);
        };
        this.position = position;
    }
    Children.prototype.setState = function (state) {
        var newStates = __spreadArray([], this.states, true);
        if (this.states.includes(state)) {
            newStates = __spreadArray(__spreadArray([], this.states, true), [state], false);
        }
        return newStates;
    };
    Children.prototype.removeState = function (state) {
        var newStates = __spreadArray([], this.states, true);
        if (this.states.includes(state)) {
            newStates = this.states.filter(function (s) { return s !== state; });
        }
        return newStates;
    };
    Children.prototype.updateSprite = function (start, end) {
        start = start !== null && start !== void 0 ? start : 0;
        end = end !== null && end !== void 0 ? end : this.sprite.count;
        if (this.states.includes('run')) {
            this.sprite.currentSprite = start + ((this.sprite.currentSprite - start + 1) % (end - start));
        }
        else if (this.states.includes('crouch')) {
            this.sprite.currentSprite = 0;
        }
    };
    Children.maxSpeed = 10;
    Children.jumpHeight = 100;
    Children.maxHealth = 200;
    return Children;
}());

var Ange = (function () {
    function Ange(position, type) {
        var _this = this;
        this.id = Engine.createUID();
        this.acceleration = 0;
        this.shootCountdown = 1500;
        this.angle = 0;
        this.lastShootTime = 0;
        this.hitbox = {
            width: 10,
            height: 10
        };
        this.health = 150;
        this.sprite = {
            url: "./sprites/ange/Ange.png",
            count: 4,
            size: {
                width: 10,
                height: 10
            },
            currentSprite: 0
        };
        this.direction = 1;
        this.speed = 5;
        this.shoot = function (position) {
            var now = Date.now();
            if (now - _this.lastShootTime < _this.shootCountdown)
                return null;
            _this.lastShootTime = now;
            var angle = Math.atan2(position.y - _this.position.y, position.x - _this.position.x);
            var pos = { x: _this.position.x + _this.sprite.size.width, y: _this.position.y + _this.sprite.size.height };
            var vector = { x: Math.cos(angle) * _this.speed, y: Math.sin(angle) * _this.speed };
            return new Bullet(_this.id, pos, vector, angle);
        };
        this.update = function (context) {
            _this.updateSprite();
            Engine.displayEntity(context, _this);
        };
        this.updateSprite = function () {
            _this.sprite.currentSprite = (_this.sprite.currentSprite + 1) % _this.sprite.count;
        };
        this.position = position;
        this.type = type;
    }
    Ange.prototype.move = function () { };
    return Ange;
}());
var GroundAnge = (function (_super) {
    __extends(GroundAnge, _super);
    function GroundAnge(position) {
        return _super.call(this, __assign(__assign({}, position), { y: 0 }), 'ground') || this;
    }
    GroundAnge.prototype.move = function () {
        this.angle += 0.05;
        this.position.x += Math.cos(this.angle) * this.speed;
        this.position.y += Math.sin(this.angle) * this.speed;
    };
    return GroundAnge;
}(Ange));
var FlyingAnge = (function (_super) {
    __extends(FlyingAnge, _super);
    function FlyingAnge(position) {
        var _this = _super.call(this, position, 'flying') || this;
        _this.move = function () { return _super.prototype.move.call(_this); };
        return _this;
    }
    return FlyingAnge;
}(Ange));

var Engine = (function () {
    function Engine(canvas, options) {
        var _a;
        if (options === void 0) { options = {}; }
        var _this = this;
        var _b, _c, _d, _e, _f;
        this.player = new Children();
        this.size = { width: Math.round(window.innerWidth / 2), height: Math.round(window.innerHeight / 2) };
        this.audioContext = new AudioContext();
        this.gain = this.audioContext.createGain();
        this.keyPressed = {};
        this.engine = 0;
        this.entities = (_a = {}, _a[this.player.id] = this.player, _a);
        this.clickableElements = {};
        this.slidersElements = {};
        this.isMuted = false;
        this.lastTimeCheckPerformance = performance.now();
        this.frameCount = 0;
        this.fps = 0;
        this.dragging = null;
        this.backgroundSound = {
            url: "./sounds/backgrounds/main.mp3",
            loop: true
        };
        this.drawFPS = function () {
            var now = performance.now();
            _this.frameCount++;
            if (now - _this.lastTimeCheckPerformance >= 1000) {
                _this.fps = _this.frameCount;
                _this.frameCount = 0;
                _this.lastTimeCheckPerformance = now;
            }
            var text = "FPS: ".concat(_this.fps);
            var textWidth = _this.context.measureText(text).width;
            var posText = {
                x: _this.canvas.width - textWidth - 50,
                y: 32
            };
            _this.context.clearRect(posText.x - 10, 0, textWidth + 50, 40);
            _this.drawText(text, posText);
            requestAnimationFrame(_this.drawFPS);
        };
        if (!canvas)
            throw new Error("Impossible d'initialiser le jeu, canvas manquant");
        this.canvas = canvas;
        var context = this.canvas.getContext('2d');
        if (!context)
            throw new Error("Impossible d'initialiser le context");
        this.context = context;
        this.gain.connect(this.audioContext.destination);
        this.canvas.width = this.size.width;
        this.canvas.height = this.size.height;
        this.inputs = (_b = options.inputs) !== null && _b !== void 0 ? _b : Engine.DEFAULT_INPUTS;
        this.debug = (_c = options.debug) !== null && _c !== void 0 ? _c : false;
        this.state = (_d = options.state) !== null && _d !== void 0 ? _d : 'lobby';
        this.stage = (_e = options.stage) !== null && _e !== void 0 ? _e : 0;
        this.tps = 1000 / ((_f = options.tps) !== null && _f !== void 0 ? _f : 20);
        this.canvas.addEventListener('click', this.handleCanvasClick.bind(this));
        this.addEventListeners();
        if (this.debug)
            this.showDebug();
        this.init();
    }
    Engine.prototype.showDebug = function () {
        requestAnimationFrame(this.drawFPS);
    };
    Engine.displayEntity = function (context, entity) {
        var img = new Image();
        img.src = entity.sprite.url;
        img.onload = function () {
            context.clearRect(entity.position.x, entity.position.y, entity.sprite.size.width, entity.sprite.size.height);
            context.drawImage(img, entity.sprite.currentSprite * entity.sprite.size.width, 0, entity.sprite.size.width, entity.sprite.size.height, entity.position.x, entity.position.y, entity.sprite.size.width, entity.sprite.size.width);
        };
    };
    Engine.createUID = function () {
        return "".concat(Date.now(), "-").concat(Math.floor(Math.random() * Date.now()));
    };
    Engine.prototype.init = function () {
        this.loadCSS('/css/game.min.css');
        this.prepareEngine({
            width: "".concat(this.canvas.width, "px"),
            height: "".concat(this.canvas.height, "px"),
            backgroundImage: 'url("/sprites/backgrounds/main-large.png")'
        });
        this.statement();
    };
    Engine.prototype.loadCSS = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, new Promise(function (_) {
                            var link = document.createElement('link');
                            link.rel = 'stylesheet';
                            link.type = 'text/css';
                            link.href = url;
                            document.head.appendChild(link);
                        })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    Engine.prototype.resetEngine = function () {
        clearInterval(this.engine);
        this.engine = 0;
    };
    Engine.prototype.updateDOMEngine = function (css, element) {
        if (element === void 0) { element = this.canvas; }
        Object.keys(css).forEach(function (key) {
            key !== "length" && key !== "parentRule" && key in element.style
                ? element.style[key] = "".concat(css[key])
                : console.warn("La propri\u00E9t\u00E9 \"".concat(key, "\" n'est pas valide"));
        });
    };
    Engine.prototype.clearScreen = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        var elements = __assign(__assign({}, this.clickableElements), this.slidersElements);
        for (var _i = 0, _a = Object.values(elements); _i < _a.length; _i++) {
            var el = _a[_i];
            this.clearElement(el);
        }
    };
    Engine.prototype.clearElement = function (element) {
        if (!element.value) {
            this.context.clearRect(element.position.x, element.position.y, element.size.width, element.size.height);
            delete this.clickableElements[element.id];
        }
        else if (element.id in this.slidersElements) {
            this.context.clearRect(element.position.x, element.position.y, element.size.width, element.radius && element.radius > element.size.height ? element.radius : element.size.height);
            delete this.slidersElements[element.id];
        }
    };
    Engine.prototype.statement = function () {
        switch (this.state) {
            case "lobby":
                this.lobby();
                break;
            case 'settings':
                this.settings();
                break;
            case 'play':
                this.start();
                break;
            case 'win':
                this.win();
                break;
            case 'defeat':
                this.defeat();
                break;
            default:
                this.lobby();
                break;
        }
    };
    Engine.prototype.handleCanvasClick = function (e) {
        var r = this.canvas.getBoundingClientRect();
        var x = e.clientX - r.left;
        var y = e.clientY - r.top;
        for (var _i = 0, _a = Object.values(this.clickableElements); _i < _a.length; _i++) {
            var el = _a[_i];
            if (x >= el.position.x &&
                x <= el.position.x + el.size.width &&
                y >= el.position.y &&
                y <= el.position.y + el.size.height) {
                el.action();
                break;
            }
        }
    };
    Engine.prototype.lobby = function () {
        var _this = this;
        this.prepareEngine({ backgroundImage: 'url("/sprites/backgrounds/main-large.png")' });
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.playSound(this.backgroundSound);
        var img = new Image();
        img.src = '/sprites/logo.png';
        img.onload = function () {
            var sizeImage = {
                width: img.width,
                height: img.height
            };
            var ImagePosOnCanvas = {
                x: (_this.canvas.width / 2) - (sizeImage.width / 2),
                y: (_this.canvas.height / 2) - (sizeImage.height / 2) - 100
            };
            _this.drawImage(img, { x: 0, y: 0 }, sizeImage, ImagePosOnCanvas, sizeImage, function () {
                _this.stage = 0;
                _this.lobby();
            });
            var text = 'Jouer';
            var TextPosOnCanvas = {
                x: (_this.canvas.width / 2) - (sizeImage.width / 2) - (_this.context.measureText(text).width / 2),
                y: (_this.canvas.height / 2) - (sizeImage.height / 2)
            };
            _this.drawText(text, TextPosOnCanvas, {
                actionOnClick: function () {
                    _this.stage = 1;
                    _this.start();
                }
            });
        };
    };
    Engine.prototype.settings = function () {
        this.prepareEngine({
            backgroundImage: "url('/sprites/backgrounds/settings.webp')"
        });
    };
    Engine.prototype.prepareEngine = function (css) {
        if (css === void 0) { css = {}; }
        this.resetEngine();
        this.clearScreen();
        this.updateDOMEngine(css);
    };
    Engine.prototype.start = function () {
        var _this = this;
        if (this.stage) {
            this.prepareEngine({
                backgroundImage: "url(\"/sprites/backgrounds/stage_".concat(this.stage, ".webp\")")
            });
            this.engine = setInterval(function () {
                _this.update();
            }, this.tps);
        }
        else {
            this.lobby();
        }
    };
    Engine.prototype.win = function () {
        this.prepareEngine({
            backgroundImage: "url('/sprites/backgrounds/win.webp')"
        });
    };
    Engine.prototype.defeat = function () {
        this.prepareEngine({
            backgroundImage: "url('/sprites/backgrounds/defeat.webp')"
        });
    };
    Engine.prototype.checkCollision = function (entity1, entity2) {
        return entity1.position.x < entity2.position.x + entity2.hitbox.width &&
            entity1.position.x + entity1.hitbox.width > entity2.position.x &&
            entity1.position.y < entity2.position.y + entity2.hitbox.height &&
            entity1.position.y + entity1.hitbox.height > entity2.position.y;
    };
    Engine.prototype.destroyEntity = function (entity) {
        var _a;
        (_a = document.getElementById(entity.id)) === null || _a === void 0 ? void 0 : _a.remove();
        delete this.entities[entity.id];
    };
    Engine.prototype.applyDamage = function (entity, amount) {
        var newHealth = entity.health - amount;
        var isDead = !this.checkHealth(__assign(__assign({}, entity), { health: newHealth }));
        entity.health = isDead ? 0 : newHealth;
        return isDead;
    };
    Engine.prototype.giveHealthToPlayer = function (amount) {
        var newHealth = this.player.health + amount;
        this.player.health = newHealth >= Children.maxHealth ? Children.maxHealth : newHealth;
    };
    Engine.prototype.giveHealthToEntity = function (entity, amount) { entity.health += amount; };
    Engine.prototype.spawnEntity = function (entity) {
        var e;
        if ('type' in entity && entity.type) {
            if (entity.type === "ground") {
                e = new GroundAnge(entity.position);
            }
            else if (entity.type === "flying") {
                e = new FlyingAnge(entity.position);
            }
            else {
                throw new Error("Type d'ange non support\u00E9 : ".concat(entity.type));
            }
        }
        else if ('origin' in entity && entity.origin) {
            e = new Bullet(entity.origin, entity.position, entity.vector, entity.angle);
        }
        else {
            e = new Children(entity.position);
        }
        this.entities[e.id] = e;
    };
    Engine.prototype.checkInputsEntries = function () {
        var _this = this;
        Object.keys(this.inputs).forEach(function (key) {
            if (_this.inputs[key] === '')
                throw new Error("Impossible d'assigner une touche vide");
        });
    };
    Engine.prototype.update = function () {
        var _this = this;
        Object.keys(this.entities).forEach(function (key) {
            _this.entities[key].update(_this.context);
        });
    };
    Engine.prototype.checkHealth = function (entity) {
        return entity.health > 0;
    };
    Engine.prototype.toggleSoundIcon = function (sound, isSoundOn) {
        var _this = this;
        var img = new Image();
        img.src = isSoundOn ? '/sprites/soundOn-small.png' : '/sprites/soundOff-small.png';
        img.onload = function () {
            var Element = {
                id: Engine.createUID(),
                position: { x: 10, y: 10 },
                size: { width: img.width, height: img.height },
                action: function () {
                    isSoundOn ? _this.setAudioVolume(1) : _this.setAudioVolume(0);
                    _this.playAudio(sound);
                    _this.clearElement(Element);
                    _this.toggleSoundIcon(sound, !isSoundOn);
                }
            };
            _this.drawImage(img, { x: 0, y: 0 }, Element.size, Element.position, Element.size, Element.action);
        };
    };
    Engine.prototype.playSound = function (sound) {
        var _this = this;
        if (this.audioContext.state === 'suspended') {
            this.drawSlider({ x: 10, y: 10 }, .5, {
                actionOnDrag: function (v) { return _this.setAudioVolume(v); }
            });
            this.toggleSoundIcon(sound, false);
        }
        else {
            this.playAudio(sound);
        }
    };
    Engine.prototype.setAudioVolume = function (value) {
        if (0 <= value && value <= 1) {
            this.gain.gain.value = value;
        }
    };
    Engine.prototype.playAudio = function (sound) {
        var _this = this;
        fetch(sound.url)
            .then(function (res) {
            if (!res.ok)
                throw new Error("Impossible de récupérer le son");
            return res.arrayBuffer();
        })
            .then(function (buffer) { return _this.audioContext.decodeAudioData(buffer); })
            .then(function (buffer) {
            var source = _this.audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(_this.gain);
            source.start();
            source.loop = sound.loop;
        })
            .catch(function (err) { return console.error("Oups ! Un probl\u00E8me est survenu ! : ".concat(err)); });
    };
    Engine.prototype.drawSlider = function (position, value, options) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (options === void 0) { options = {}; }
        var sliderColor = (_a = options.sliderColor) !== null && _a !== void 0 ? _a : "gray";
        var sliderHeight = (_c = (_b = options.size) === null || _b === void 0 ? void 0 : _b.height) !== null && _c !== void 0 ? _c : 5;
        var sliderWidth = (_e = (_d = options.size) === null || _d === void 0 ? void 0 : _d.width) !== null && _e !== void 0 ? _e : 200;
        var cursorColor = (_f = options.cursorColor) !== null && _f !== void 0 ? _f : "blue";
        var cursorRadius = (_g = options.cursorRadius) !== null && _g !== void 0 ? _g : 8;
        this.context.clearRect(position.x, position.y, sliderWidth, sliderHeight > cursorRadius ? sliderHeight : cursorRadius);
        this.context.fillStyle = sliderColor;
        this.context.fillRect(position.x, position.y, sliderWidth, sliderHeight);
        var knobX = position.x + value * sliderWidth;
        this.context.beginPath();
        this.context.arc(knobX, position.y + (sliderHeight / 2), cursorRadius, 0, Math.PI * 2);
        this.context.fillStyle = cursorColor;
        this.context.fill();
        var id = Engine.createUID();
        this.slidersElements[id] = {
            id: id,
            position: position,
            size: {
                width: sliderWidth,
                height: sliderHeight
            },
            sliderColor: sliderColor,
            cursorColor: cursorColor,
            radius: cursorRadius,
            value: value,
            action: (_h = options.actionOnDrag) !== null && _h !== void 0 ? _h : Engine.NO_ACTION
        };
    };
    Engine.prototype.drawImage = function (source, posImage, sizeImage, posOnCanvas, printedSize, actionOnClick) {
        if (actionOnClick === void 0) { actionOnClick = Engine.NO_ACTION; }
        var id = Engine.createUID();
        this.context.clearRect(posOnCanvas.x, posOnCanvas.y, sizeImage.width, sizeImage.height);
        this.context.drawImage(source, posImage.x, posImage.y, sizeImage.width, sizeImage.height, posOnCanvas.x, posOnCanvas.y, printedSize.width, printedSize.height);
        this.clickableElements[id] = {
            id: id,
            position: {
                x: posOnCanvas.x,
                y: posOnCanvas.y
            },
            size: {
                width: sizeImage.width,
                height: sizeImage.height
            },
            action: actionOnClick
        };
    };
    Engine.prototype.drawText = function (text, posText, options) {
        var _a, _b, _c, _d;
        if (options === void 0) { options = {
            fontName: "Jersey",
            fontSize: 24,
            color: "#fff",
            actionOnClick: Engine.NO_ACTION
        }; }
        var fontSize = (_a = options.fontSize) !== null && _a !== void 0 ? _a : 24;
        var id = Engine.createUID();
        this.context.font = "".concat(fontSize, "px ").concat((_b = options.fontName) !== null && _b !== void 0 ? _b : "Jersey");
        this.context.fillStyle = (_c = options.color) !== null && _c !== void 0 ? _c : "#fff";
        this.context.fillText(text, posText.x, posText.y);
        this.clickableElements[id] = {
            id: id,
            position: {
                x: posText.x,
                y: posText.y
            },
            size: {
                width: this.context.measureText(text).width,
                height: fontSize
            },
            action: (_d = options.actionOnClick) !== null && _d !== void 0 ? _d : Engine.NO_ACTION
        };
    };
    Engine.prototype.addEventListeners = function () {
        var _this = this;
        this.canvas.addEventListener("mousedown", function (e) {
            for (var _i = 0, _a = Object.values(_this.slidersElements); _i < _a.length; _i++) {
                var slider = _a[_i];
                var knobX = slider.position.x + slider.value * slider.size.width;
                if (Math.abs(e.offsetX - knobX) < slider.radius && Math.abs(e.offsetY - slider.position.y) < slider.radius)
                    _this.dragging = slider;
            }
        });
        this.canvas.addEventListener("mousemove", function (e) {
            if (_this.dragging) {
                var volume = Math.max(0, Math.min(1, (e.offsetX - _this.dragging.position.x) / _this.dragging.size.width));
                _this.dragging.value = volume;
                _this.dragging.action(volume);
                _this.drawSlider(_this.dragging.position, _this.dragging.value);
            }
        });
        this.canvas.addEventListener("mouseup", function () {
            _this.dragging = null;
        });
        this.canvas.addEventListener("mouseleave", function () {
            _this.dragging = null;
        });
    };
    Engine.NO_ACTION = function () { };
    Engine.DEFAULT_INPUTS = {
        jump: "z",
        left: "q",
        right: "f",
        crouch: "s",
        pause: "Escape"
    };
    return Engine;
}());

window.addEventListener('load', function () {
    var canvasGame = document.querySelector('#evagame');
    if (!canvasGame)
        throw new Error("Impossible d'initialiser le jeu, canvas manquant");
    var options = { debug: true };
    new Engine(canvasGame, options);
});
