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
        let found = false;
        const temp = [];
        for (let i = 0; i < this.hands.length; i++) {
            if (!found && this.hands[i].isEquals(targetCard)) {
                found = true;
                continue;
            }
            temp.push(this.hands[i]);
        }
        this.hands = temp;
    }
}