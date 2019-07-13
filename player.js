class Player {
    constructor(name, hands) {
        this.name = name;
        this.hands = hands;

        /** UNO と宣言していれば、true */
        this.isUno = false;
    }

    /**
     * カードを1枚引く（手札に加える）
     */
    draw(targetCard) {
        this.hands.push(targetCard);
    }

    /**
     * カードを1枚出す（手札から取り除く）
     */
    play(targetCard) {
        this.hands = this.hands.filter((card) => {
            return !card.isEquals(targetCard);
        });
    }
}