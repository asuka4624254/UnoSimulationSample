// console.log() で見やすいように、実際の値は文字列
const COLOR = {
    NONE: 'none',
    RED: 'red',
    YELLOW: 'yellow',
    GREEN: 'green',
    BLUE: 'blue'
};

const TYPE = {
    NONE: 'none',
    DRAW_2: 'draw_2',
    REVERSE: 'reverse',
    SKIP: 'skip',
    WILD: 'wild',
    WILD_DRAW_4: 'wild_draw_4'
};

const NUMBER = {
    NONE: 'none'
};

class Card {
    constructor(color, type, number) {
        this.color = color;
        this.type = type;
        this.number = number;
    }

    /**
     * カードを画像で表示するタグを返す
     */
    getImageHtml() {
        let filename = '';

        if (this.isWildCard()) {
            switch (this.type) {
                case TYPE.WILD:
                    filename += 'w';
                    break;
                case TYPE.WILD_DRAW_4:
                    filename += 'wd4';
                    break;
            }
        }
        else {
            switch (this.color) {
                case COLOR.RED:
                    filename += 'r';
                    break;
                case COLOR.YELLOW:
                    filename += 'y';
                    break;
                case COLOR.GREEN:
                    filename += 'g';
                    break;
                case COLOR.BLUE:
                    filename += 'b';
                    break;
            }

            if (this.isSpecialCard()) {
                switch (this.type) {
                    case TYPE.DRAW_2:
                        filename += 'd2';
                        break;
                    case TYPE.REVERSE:
                        filename += 'r';
                        break;
                    case TYPE.SKIP:
                        filename += 's';
                        break;
                }
            }
            else {
                filename += this.number;
            }
        }
        return `<img class="card" src="images/${filename}.png" />`;
    }

    /**
     * ワイルドカードかどうか
     */
    isWildCard() {
        return this.type == TYPE.WILD || this.type == TYPE.WILD_DRAW_4;
    }

    /**
     * 特殊カードかどうか
     */
    isSpecialCard() {
        return this.type == TYPE.DRAW_2 || this.type == TYPE.REVERSE || this.type == TYPE.SKIP;
    }

    /**
     * 同一のカードかどうか
     */
    isEquals(card) {
        return this.color == card.color &&
            this.type == card.type &&
            this.number == card.number;
    }

    /**
     * 同じ色のカードかどうか
     */
    isSameColor(card) {
        if (this.color == COLOR.NONE || card.color == COLOR.NONE) {
            return false;
        }
        if (this.color == card.color) {
            return true;
        }
        return false;
    }

    /**
     * 同じ特殊カードかどうか（色は問わない）
     */
    isSameSpecialType(card) {
        if (this.type == TYPE.NONE || card.type == TYPE.NONE) {
            return false;
        }
        if (this.type == card.type) {
            return true;
        }
        return false;
    }

    /**
     * 同じ数字のカードかどうか（色は問わない）
     */
    isSameNumber(card) {
        if (this.number == NUMBER.NONE || card.number == NUMBER.NONE) {
            return false;
        }
        if (this.number == card.number) {
            return true;
        }
        return false;
    }
}
