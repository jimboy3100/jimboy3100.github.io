    killCell(size1, size2, distance) {
        const splitDistance = Math.max(
            2 * size1 / this.listener.settings.playerSplitSizeDiv / 2,
            controller.splitSpeed);
        return size1 / controller.playerSplitSizeDiv > size2 * controller.eatCalc &&
               distance - splitDistance <= size1 - size2 / controller.eatCalcDiv;
    }
