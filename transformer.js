var entries = {
    k1: "k1Value",
    k2: "k2Value"
}

function replaceSummaryJsonValues(summary) {
    const jsonKeysPattern = /%([^%]+)%/g;

    let result;
    let replacedJsonKeys = [];
    let notReplacedJsonKeys = [];
    while ((result = jsonKeysPattern.exec(summary)) !== null) {
        const jsonKey = result[1];
        let jsonValue = entries[jsonKey];
        let keyPattern = `%${jsonKey}%`;
        // only replace when value is available
        if (jsonValue) {
            summary = summary.replace(new RegExp(keyPattern, 'g'), jsonValue);
            replacedJsonKeys.push(jsonKey);
        } else {
            summary = summary.replace(new RegExp(keyPattern, 'g'), '');
            notReplacedJsonKeys.push(jsonKey);
        }
    }

    return {summary: summary, replacedJsonKeys: replacedJsonKeys, notReplacedJsonKeys: notReplacedJsonKeys}
}

function createSummary() {
    let summary = "Ticket: %k1% [-]k2? %k2% [-]k3? %k3% [nur wenn k2]k2?";
    let summaryResult = replaceSummaryJsonValues(summary);
    summary = adjustOptionalValues(summaryResult.summary, summaryResult.replacedJsonKeys, summaryResult.notReplacedJsonKeys);
    console.log(summary);
}

createSummary();

function adjustOptionalValues(summary, replacedJsonKeys, notReplacedJsonKeys) {
    for (const jsonKey of replacedJsonKeys) {
        const optionalReplacementPattern = `\\[([\\w\\s\\-]+)\\]${jsonKey}\\?`;

        let regExpOptional = new RegExp(optionalReplacementPattern, 'g');
        let optionalResult;

        // the regex, which is used for the search should not be changed, because otherwise, summary would change and you get some strange behaviour
        const summaryToSearch = summary;
        // for each optional pattern, which is found
        while ((optionalResult = regExpOptional.exec(summaryToSearch)) !== null) {
            // replace with <someText>
            let textToReplaceIfKeyIsAvailable = optionalResult[1];
            let regExpOptionalWithText = new RegExp(`\\[${textToReplaceIfKeyIsAvailable}\\]${jsonKey}\\?`, 'g');
            summary = summary.replace(regExpOptionalWithText, textToReplaceIfKeyIsAvailable);
        }
    }

    for (const jsonKey of notReplacedJsonKeys) {
        const optionalReplacementPattern = `\\[([\\w\\s\\-]+)\\]${jsonKey}\\?`;

        let regExpOptional = new RegExp(optionalReplacementPattern, 'g');
        // delete the complete pattern ??<someText>@@<jsonKey>??
        summary = summary.replace(regExpOptional, '');
    }
    return summary;
}