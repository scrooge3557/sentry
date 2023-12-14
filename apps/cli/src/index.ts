import Vorpal from 'vorpal';
import { addAdmin } from './commands/access-control/add-admin.js';
import { addChallenger } from './commands/access-control/add-challenger.js';
import { bootChallenger } from './commands/boot-challenger.js';
import { createBlsKeyPair } from './commands/create-bls-key-pair.js';
import { createMnemonic } from './commands/create-mnemonic.js';
import { getAssertionCheckingStatus } from './commands/get-assertion-checking-status.js';
import { getListOfAdmins } from './commands/access-control/get-list-of-admins.js';
import { getListOfChallengers } from './commands/access-control/get-list-of-challengers.js';
import { getPrivateKeyFromMnemonic } from './commands/get-private-key-from-memonic.js';
import { getPublicKeyFromPrivateKey } from './commands/get-public-key-from-private-key.js';
import { manuallyChallengeAssertion } from './commands/manually-challenge-assertion.js';
import { removeAdmin } from './commands/access-control/remove-admin.js';
import { removeChallenger } from './commands/access-control/remove-challenger.js';
import { setChallengerPublicKey } from './commands/set-challenger-public-key.js';
import { toggleAssertionChecking } from './commands/toggle-assertion-checking.js';
import { addOperator } from './commands/operator-control/add-operator.js';
import { removeOperator } from './commands/operator-control/remove-operator.js';
import { listOperators } from './commands/operator-control/list-operators.js';
import { mintNodeLicenses } from "./commands/licenses/mint-node-licenses.js";
import { listNodeLicenses } from './commands/licenses/list-node-licenses.js';
import { setRollupAddress } from './commands/set-rollup-address.js';
import { getListOfKycAdmins } from './commands/access-control/get-list-of-kyc-admins.js';
import { addKycAdmin } from './commands/access-control/add-kyc-admin.js';
import { removeKycAdmin } from './commands/access-control/remove-kyc-admin.js';
import { listKycStatuses } from './commands/kyc/list-kyc-status.js';
import { checkKycStatus } from './commands/kyc/check-kyc-status.js';
import { setKycStatus } from './commands/kyc/set-kyc-status.js';
import { totalSupply } from './commands/xai-token/total-supply.js';
import { getBalancesForAddresses } from './commands/xai-token/get-balances.js';
import { getAllContractAddresses } from './commands/get-contract-addresses.js';
import { checkWhitelist } from './commands/xai-token/check-whitelist.js';
import { changeWhitelistStatus } from './commands/xai-token/change-whitelist-status.js';
import { getPriceForQuantity } from './commands/licenses/get-price-for-quantity.js';
import { listTiers } from './commands/licenses/list-tiers.js';
import { getTotalSupplyAndCap } from './commands/licenses/get-total-supply-and-cap-of-licenses.js';
import { getReferralRewards } from './commands/licenses/get-referral-rewards.js';
import { getReferralDiscountAndRewardPercentages } from './commands/licenses/get-referral-discount-and-reward-percentages.js';
import { setReferralDiscountAndRewardPercentages } from './commands/licenses/set-referral-discount-and-reward-percentages.js';
import { bootOperator } from './commands/operator-control/operator-runtime.js';
import { setOrAddPricingTiersCommand } from './commands/licenses/set-or-add-pricing-tiers.js';
import { addPromoCode } from './commands/licenses/add-promo-code.js';
import { removePromoCode } from './commands/licenses/remove-promo-code.js';
import { resolve } from 'path';
import * as fs from "fs";
import * as https from "https";
import * as unzipper from "unzipper";
import axios from "axios";

const cli = new Vorpal();

// entrypoints to each of the commands
addAdmin(cli);
addChallenger(cli);
addKycAdmin(cli);
addOperator(cli);
addPromoCode(cli);
bootChallenger(cli);
bootOperator(cli);
changeWhitelistStatus(cli);
checkKycStatus(cli);
checkWhitelist(cli);
createBlsKeyPair(cli);
createMnemonic(cli);
getAllContractAddresses(cli);
getAssertionCheckingStatus(cli);
getBalancesForAddresses(cli);
getListOfAdmins(cli);
getListOfChallengers(cli);
getListOfKycAdmins(cli);
getPriceForQuantity(cli);
getPrivateKeyFromMnemonic(cli);
getPublicKeyFromPrivateKey(cli);
getReferralDiscountAndRewardPercentages(cli);
getReferralRewards(cli);
getTotalSupplyAndCap(cli);
listKycStatuses(cli);
listNodeLicenses(cli);
listOperators(cli);
listTiers(cli);
manuallyChallengeAssertion(cli);
mintNodeLicenses(cli);
removeAdmin(cli);
removeChallenger(cli);
removeKycAdmin(cli);
removeOperator(cli);
removePromoCode(cli);
setChallengerPublicKey(cli);
setKycStatus(cli);
setOrAddPricingTiersCommand(cli);
setReferralDiscountAndRewardPercentages(cli);
setRollupAddress(cli);
toggleAssertionChecking(cli);
totalSupply(cli);

async function downloadFile(url: string, destination: string): Promise<void> {
	const response = await axios.get(url, {responseType: "stream"});

	const writer = fs.createWriteStream(destination);

	response.data.pipe(writer);

	return new Promise<void>((resolve, reject) => {
		writer.on("finish", resolve);
		writer.on("error", reject);
	});
}

async function unzipFile(source: string, destination: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		fs.createReadStream(source)
			.pipe(unzipper.Extract({ path: destination }))
			.on('error', reject)
			.on('finish', resolve);
	});
}

// setInterval(async () => {
// 	const {data: {tag_name: tagName}} = await axios.get("https://api.github.com/repos/xai-foundation/sentry/releases/latest");
//
// 	let updateUrl: string;
// 	switch (process.platform) {
// 		case "darwin":
// 			updateUrl = `https://github.com/xai-foundation/sentry/releases/download/${tagName}/sentry-node-cli-macos.zip`;
// 			break;
// 		case "linux":
// 			updateUrl = `https://github.com/xai-foundation/sentry/releases/download/${tagName}/sentry-node-cli-linux.zip`;
// 			break;
// 		case "win32":
// 			updateUrl = `https://github.com/xai-foundation/sentry/releases/download/${tagName}/sentry-node-cli-windows.zip`;
// 			break;
// 		default:
// 			return;
// 	}
//
// 	const zipDestination = "";
// 	const updateDestination = "";
// 	await downloadFile(updateUrl, zipDestination);
// 	await unzipFile(zipDestination, updateDestination);
//
// 	await cli.exec("exit", );
//
// }, 1000 * 60 * 5);

cli
    .delimiter('sentry-node$')
    .show()
    .log('\nType "help" to display a list of actions.');
