class Uno {
    constructor() {
        /** プレイが可能な状態かどうか */
        this.playable = true;
        /** プレイヤーの人数 */
        this.playerNum = 0;
        /** プレイヤー情報 */
        this.players = [];
        /** 山札（インデックス番号「0」から引いていく） */
        this.drawDeck = [];
        /** 捨て札の山（インデックス番号「0」が最後に出されたカードになる） */
        this.discardPile = [];
        /** ワイルドカード使用時に選択された色（未設定の場合は null が入る） */
        this.selectedColor = null;

        /** 現在のプレイヤー */
        this.currentPlayer = null;
        /** 捨て札（通常は this.discardPile[0] になる） */
        this.discard = null;
    }

    /**
     * ゲームの準備をする
     */
    init(playerNames) {
        this.playerNum = Array.isArray(playerNames) ? playerNames.length : 0;

        if (this.playerNum < 2 || this.playerNum > 15) {
            this.showInfo('プレイヤーの人数が正しくありません');
            this.playable = false;
            return;
        }

        const cards = Utility.createInitialCards();
        this.drawDeck = Utility.shuffle(cards);

        playerNames.forEach((name) => {
            this.players.push(new Player(name, this.drawDeck.slice(0, 7)));
            this.drawDeck = this.drawDeck.slice(7);
        });

        // 捨て札の山に初期カードを置く
        this.setInitialCard();

        this.showInfo('初期カード', true);
    }

    /**
     * 捨て札の山に初期カード1枚を置く
     */
    setInitialCard() {
        for (let i = 0; i < this.drawDeck.length; i++) {
            const card = this.drawDeck[i];
            if (card.isWildCard() || card.isSpecialCard()) {
                continue;
            }
            this.discardPile.unshift(card);
            // 順番を変えずに初期カードだけを取り除く
            this.drawDeck = this.drawDeck.filter((element, index) => {
                return index !== i;
            });
            break;
        }
    }

    /**
     * ゲームをプレイ
     */
    play() {
        if (!this.playable) {
            return;
        }

        let i = 0;
        let clockwise = true; // 時計回り
        let drawNext = false; // ドローするか
        let skipNext = false; // 次をスキップするか

        while (true) {
            this.currentPlayer = this.players[i];
            this.discard = this.discardPile[0];

            // 山札が無い場合は捨て札の山をシャッフルして再利用する
            if (this.drawDeck.length < 1) {
                this.replenish();
            }

            this.showInfo(`${this.currentPlayer.name}の手番です`, true);

            // --------------------
            // 捨て札の山をチェック
            // --------------------
            if (drawNext && this.discard.type == TYPE.DRAW_2) {
                this.draw(2);
                drawNext = false;
                this.showInfo('ドロー2が出されたため、2枚引きました');
            }
            if (drawNext && this.discard.type == TYPE.WILD_DRAW_4) {
                this.draw(4);
                drawNext = false;
                this.showInfo('ワイルドドロー4が出されたため、4枚引きました');
            }

            // --------------------
            // 手札から出せるカードを探す
            // --------------------
            let playableCards = this.getPlayableCard();
            console.log(playableCards);

            if (playableCards.length < 1) {
                // 出せる手札が無い場合は山札から一枚引く
                this.draw(1);
                this.showInfo('出せる手札が無いため、山札から一枚引きました');

                playableCards = this.getPlayableCard();
            }

            if (playableCards.length > 0) {
                // 出せるカードの中からランダムで一枚出す
                const index = Math.floor(Math.random() * playableCards.length);
                const playCard = playableCards[index];

                // 出すカードがワイルドカードの場合は色を選択する
                if (playCard.isWildCard()) {
                    this.selectColor();
                }
                // 出すカードがリバース
                if (playCard.type == TYPE.REVERSE) {
                    clockwise = !clockwise;
                }
                // 出すカードがドロー
                if (playCard.type == TYPE.DRAW_2 || playCard.type == TYPE.WILD_DRAW_4) {
                    drawNext = true;
                }
                // 出すカードがスキップ
                if (playCard.type == TYPE.SKIP) {
                    skipNext = true;
                }

                this.discardPile.unshift(playCard);
                this.currentPlayer.play(playCard);
                this.showInfo(`出したカード：${playCard.getImageHtml()}`);
                this.showInfo('出せるカードの中からランダムで一枚出しました');
            }

            // --------------------
            // UNO宣言
            // --------------------
            if (this.currentPlayer.hands.length == 1) {
                this.currentPlayer.isUno = true;
                this.showInfo(`${this.currentPlayer.name}が「UNO!」と言いました！`);
            }
            else if (this.currentPlayer.hands.length > 1) {
                this.currentPlayer.isUno = false;
            }

            // --------------------
            // 終了条件
            // --------------------
            if (this.currentPlayer.hands.length < 1) {
                this.showInfo(`${this.currentPlayer.name}の上がりです！`);
                break;
            }

            // --------------------
            // インデックスを更新
            // --------------------
            if (clockwise) { // 0 -> 1 -> 2 ...
                skipNext ? i += 2 : i++;
                if (i >= this.playerNum) i = i - this.playerNum;
            }
            else { // 2 -> 1 -> 0 ...
                skipNext ? i -= 2 : i--;
                if (i < 0) i = i + this.playerNum;
            }
            skipNext = false;
        }
    }

    /**
     * 捨て札の山の最後に出されたカード以外をシャッフルして山札に補充する
     */
    replenish() {
        const cards = Utility.shuffle(this.discardPile.slice(1));
        this.drawDeck = this.drawDeck.concat(cards);
        this.discardPile = [this.discard];
        this.showInfo('山札にカードを補充しました！');
    }

    /**
     * カードを引く
     *
     * @param num 引く枚数
     */
    draw(num) {
        let imageHtmls = [];
        for (let i = 0; i < num; i++) {
            if (this.drawDeck.length < 1) {
                this.replenish();
            }
            this.currentPlayer.draw(this.drawDeck[0]);
            this.drawDeck = this.drawDeck.slice(1);

            imageHtmls.push(this.drawDeck[0].getImageHtml());
        }
        this.showInfo(`引いたカード：${imageHtmls.join(' ')}`);
    }

    /**
     * プレイ可能な手札を返す
     */
    getPlayableCard() {
        return this.currentPlayer.hands.filter(card => {
            // ワイルドカードなら出せる
            if (card.isWildCard()) {
                return true;
            }
            if (this.selectedColor == null) {
                if (card.isSameColor(this.discard) ||
                    card.isSameSpecialType(this.discard) ||
                    card.isSameNumber(this.discard)) {
                    return true;
                }
            }
            else if (this.selectedColor == card.color) {
                // 色指定ありの場合、指定の色のみ出せる
                this.selectedColor = null;
                return true;
            }
            return false;
        });
    }

    /**
     * 色を指定する
     */
    selectColor() {
        const hands = this.currentPlayer.hands;

        let red = 0;
        let yellow = 0;
        let green = 0;
        let blue = 0;

        for (let i = 0; i < hands.length; i++) {
            switch (hands[i].color) {
                case COLOR.RED:
                    red++;
                    break;
                case COLOR.YELLOW:
                    yellow++;
                    break;
                case COLOR.GREEN:
                    green++;
                    break;
                case COLOR.BLUE:
                    blue++;
                    break;
            }
        }

        const max = Math.max(red, yellow, green, blue);
        const maxColors = [];

        if (red == max) maxColors.push(COLOR.RED);
        if (yellow == max) maxColors.push(COLOR.YELLOW);
        if (green == max) maxColors.push(COLOR.GREEN);
        if (blue == max) maxColors.push(COLOR.BLUE);

        if (maxColors.length < 1) {
            // ワイルドカードしか無い場合、色は何でもいいのでランダムに決める
            const index = Math.floor(Math.random() * 4 + 1);
            this.selectedColor = index;
        }
        else if (maxColors.length == 1) {
            this.selectedColor = maxColors[0];
        }
        else {
            const index = Math.floor(Math.random() * maxColors.length);
            this.selectedColor = maxColors[index];
        }

        this.showInfo(`「${this.selectedColor}」を指定しました`);
    }

    /**
     * 画面出力
     */
    showInfo(message, detail = false) {
        if (!this.playable) {
            return;
        }

        let html = $("div#debug_info").html();

        if (detail) {
            let drawDeck = this.drawDeck;
            let period = '';
            if (this.drawDeck.length > 10) {
                // drawDeck = drawDeck.slice(0, 9);
                // period = '...';
            }

            drawDeck = drawDeck.map((card) => { return card.getImageHtml(); }).join('\n');
            const discardPile = this.discardPile.map((card) => { return card.getImageHtml(); }).join('\n');

            html += `<hr /><table>
                <tr><td>プレイ人数</td><td>${this.playerNum}</td></tr>
                <tr><td>山札</td><td>${drawDeck} ${period}</td></tr>
                <tr><td>捨て札の山</td><td>${discardPile}</td></tr>
                <tr><td>指定された色</td><td>${this.selectedColor}</td></tr>`;

            for (let i = 0; i < this.playerNum; i++) {
                const uno = this.players[i].isUno ? '<span class="uno">UNO!</span>' : '';
                const hand = this.players[i].hands.map((card) => { return card.getImageHtml(); }).join('\n');
                html += `<tr><td>${this.players[i].name}の手札（${i}人目）${uno}</td><td>${hand}</td></tr>`;
            }

            html += `</table>`;
        }

        html += message ? `<p>${message}</p>` : '';

        $("div#debug_info").html(html);
    }
}