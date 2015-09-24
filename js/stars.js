// Load background particles
particlesJS.load('particles-js', '../particles.json');

var curveGroup;
var placeholderGroup;
var textGroup;

initializeText();

function onResize(event) {
    scaleText();
}

// Called up to 60 times/second
function onFrame(event) {
    var scroll = document.body.scrollTop / 700;
    curveGroup.position.y = 350 + scroll * 700;

    for (var i = 0; i < curveGroup.children.length; i++) {
        curveGroup.children[i].strokeColor.alpha = 1 - 4 * scroll;
        curveGroup.children[i].strokeWidth = 2 - 2 * scroll;
    }

    for (var i = 0; i < textGroup.children.length; i++) {
        var letter = textGroup.children[i];
        letter.strokeWidth = 2 - 0.5 * Math.log(1 + 100 * scroll);

        // Multiple paths per letter
        for (var j = 0; j< letter.children.length; j++) {
            var path = letter.children[j];
            if (!path.data.vector) {
                path.data.vector = randVector(view.size.width);
                path.data.alpha = Math.random();
                path.data.segmentVectors = [];
                for (var k = 0; k < path.segments.length; k++) {
                    path.data.segmentVectors.push(randVector(view.size.width / 10));
                }
            }
            path.strokeColor = 'white';
            path.strokeColor.alpha = path.data.alpha;

            for (var k = 0; k < path.segments.length; k++) {
                path.segments[k].point = placeholderGroup.children[i].children[j].segments[k].point + (path.data.segmentVectors[k] + path.data.vector) * scroll;
            }
        }
    }
}

function scaleText() {
    curveGroup.removeChildren();
    placeholderGroup.removeChildren();
    textGroup.removeChildren();
    initializeText();

    var marginY = view.size.height * 0.2;
    var bounds = new Rectangle(
        new Point(50, marginY),
        new Point(150 + view.size.width * 0.3, view.size.height - marginY)
        );
    project.activeLayer.fitBounds(bounds);
}

function initializeText() {
    curveGroup = new Group();
    placeholderGroup = new Group();
    textGroup = new Group();

    var v3 = new Point({ angle: 0, length: 3 });
    var v5 = new Point({ angle: 0, length: 5 });
    var v6 = new Point({ angle: 0, length: 6 });
    var v8 = new Point({ angle: 0, length: 8 });

    var s = new Path({ segments: [
        [[20, 5], null, v3.rotate(-100)],
        [[10, 0], v6, v3.rotate(180)],
        [[0, 8], v6.rotate(-90), v8.rotate(90)],
        [[20, 24], v8.rotate(-90), v6.rotate(90)],
        [[10, 32], v6, v6.rotate(180)],
        [[0, 25], v3.rotate(80), null]
        ]});

    var a1 = new CompoundPath({ children: [
        new Path({ segments: [[0, 32], [13, 0], [26, 32]] }),
        new Path({ segments: [[4.0625, 22], [21.9375, 22]] })
        ]});

    var b = new Path({ segments: [
        [0, 32],
        [0, 0],
        [[8, 0], null, v6],
        [[17, 8], v5.rotate(-90), v5.rotate(90)],
        [[8, 16], v6, null],
        [0, 16],
        [[9, 16], null, v6],
        [[18, 23.5], v5.rotate(-90), v5.rotate(90)],
        [[9, 32], v6, null],
        [0, 32]
        ]});

    var r1 = new Path({ segments: [
        [0, 32],
        [0, 0],
        [[8, 0], null, v6],
        [[18, 8], v5.rotate(-90), v5.rotate(90)],
        [[8, 16], v6, null],
        [0, 16],
        [10, 16],
        [18, 32]
        ]});

    var i = new CompoundPath({ children: [
        new Path({ segments: [[0, 0], [0, 32]] })
        ]});

    var n1 = new CompoundPath({ children: [
        new Path({ segments: [[0, 32], [0,2]] }),
        new Path({ segments: [[0, 2], [24, 31], [24, 0]] })
        ]});

    var a2 = a1.clone();

    var r2 = r1.clone();

    var e = new CompoundPath({ children: [
        new Path({ segments: [[21, 0], [0, 0], [0, 16]] }),
        new Path({ segments: [[0, 16], [20, 16]] }),
        new Path({ segments: [[0, 16], [0, 32], [21, 32]] })
        ]});

    var n2 = n1.clone();

    var text = [s, a1, b, r1, i, n1, a2, r2, e, n2];

    var x = 2;
    var kerning = 12;

    for (var i = 0; i < text.length; i++) {
        text[i].strokeWidth = 2;
        text[i].strokeColor = 'white';
        text[i].translate(new Point(x, 0));
        x += text[i].bounds.width + kerning;
        if (text[i] == a2) x += kerning;
        textGroup.addChild(text[i]);
    }
    curveGroup = new Group([s, b, r1, r2]);
    placeholderGroup = textGroup.clone();
    placeholderGroup.strokeWidth = 0;
}

function randVector(scale) {
    return new Point({
        angle   : Math.random() * 360,
        length  : Math.random() * scale
    })
}