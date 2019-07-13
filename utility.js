class Utility {
    constructor() { }

    /**
     * UNO に必要なカード108枚を返す
     */
    static createInitialCards() {
        const red = this.createColorCards(COLOR.RED);
        const yellow = this.createColorCards(COLOR.YELLOW);
        const green = this.createColorCards(COLOR.GREEN);
        const blue = this.createColorCards(COLOR.BLUE);

        const wild = Array(4).fill(new Card(COLOR.NONE, TYPE.WILD, NUMBER.NONE));
        const wildDraw4 = Array(4).fill(new Card(COLOR.NONE, TYPE.WILD_DRAW_4, NUMBER.NONE));

        return [].concat(red, yellow, green, blue, wild, wildDraw4);
    }

    /**
     * 色付きのカードを返す
     */
    static createColorCards(color) {
        const number = [...Array(10).keys(), ...Array(10).keys()]; // 0～9までを2個ずつ用意
        number.shift(); // 0は1個だけのため、1個削除

        let cards = number.map(number => {
            return new Card(color, TYPE.NONE, number);
        });

        cards = cards.concat(Array(2).fill(new Card(color, TYPE.DRAW_2, NUMBER.NONE)));
        cards = cards.concat(Array(2).fill(new Card(color, TYPE.REVERSE, NUMBER.NONE)));
        cards = cards.concat(Array(2).fill(new Card(color, TYPE.SKIP, NUMBER.NONE)));

        return cards;
    }

    /**
     * カードをシャッフルする
     */
    static shuffle(cards) {
        for (let i = cards.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let t = cards[i];
            cards[i] = cards[j];
            cards[j] = t;
        }

        return cards;
    }
}