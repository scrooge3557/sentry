import {useAtomValue, useSetAtom} from "jotai";
import {drawerStateAtom} from "@/features/drawer/DrawerManager";
import {chainStateAtom} from "@/hooks/useChainDataWithCallback";
import {XaiCheckbox} from "@sentry/ui";
import {useEffect, useState} from "react";
import {useStorage} from "@/features/storage";
import {useOperatorRuntime} from "@/hooks/useOperatorRuntime";
import {useOperator} from "@/features/operator";

export function WhitelistDrawer() {
	const setDrawerState = useSetAtom(drawerStateAtom);
	const {owners} = useAtomValue(chainStateAtom);
	const {data, setData} = useStorage();
	const [selected, setSelected] = useState<string[]>([]);
	const {sentryRunning, stopRuntime} = useOperatorRuntime();
	const {publicKey: operatorAddress} = useOperator();

	const disableButton = selected.length <= 0 || !stopRuntime;

	useEffect(() => {
		if (data && data.whitelistedWallets) {
			setSelected(data.whitelistedWallets);
		}
	}, []);

	const toggleSelected = (wallet: string) => {
		setSelected((prevSelected) => prevSelected.includes(wallet)
			? prevSelected.filter((item) => item !== wallet)
			: [...prevSelected, wallet]
		);
	};

	const getOperatorItem = () => {
		if (operatorAddress) {
			return (
				<div>
					<div
						className="p-2 cursor-pointer hover:bg-gray-100"
					>
						<XaiCheckbox
							onClick={() => toggleSelected(operatorAddress)}
							condition={selected.includes(operatorAddress)}
						>
							{operatorAddress}
						</XaiCheckbox>
					</div>
				</div>
			)
		}
	}

	const getDropdownItems = () => (
		<div>
			{owners.map((wallet, i) => (
				<div
					className="p-2 cursor-pointer hover:bg-gray-100"
					key={`whitelist-item-${i}`}
				>
					<XaiCheckbox
						onClick={() => toggleSelected(wallet)}
						condition={selected.includes(wallet)}
					>
						{wallet}
					</XaiCheckbox>
				</div>
			))}
		</div>
	);

	async function handleSubmit() {
		await setData({
			...data,
			whitelistedWallets: selected,
		});

		setDrawerState(null);
		if (stopRuntime) {
			void stopRuntime();
		}
	}

	return (
		<div className="relative h-full flex flex-col justify-start items-center">
			<div
				className="w-full h-[4rem] min-h-[4rem] flex flex-row justify-between items-center border-b border-gray-200 text-lg font-semibold px-8">
				<p>Allowed Wallet</p>
			</div>

			<div className="flex-grow overflow-y-scroll max-h-[calc(100vh-4rem)] px-6 pt-[1rem]">
				<p className="mb-2 text-[15px]">
					Below are the wallets assigned to your Sentry Wallet ({operatorAddress}). Select the wallets
					you'd like to enable.
				</p>
				<p className="mb-4 text-[15px]">
					Note: Gas fees will be covered using your Sentry Wallet funds whenever an enabled wallet is eligible
					to participate in a challenge.
				</p>
				<div>
					<p className="text-[12px]">Your Sentry Wallet</p>
					{getOperatorItem()}
					<p className="text-[12px]">Assigned Wallets</p>
					{getDropdownItems()}
				</div>
			</div>

			<div className="w-full flex-shrink-0 h-18 bg-white flex flex-col items-center justify-center px-2">
				<p className="text-[14px]">
					Applying changes will restart your sentry
				</p>

				<div className="w-full h-16 flex items-center justify-center gap-1">
					<button
						onClick={() => {
							setDrawerState(null)
						}}
						className="w-full h-auto text-[15px] text-[#F30919] border border-[#F30919] px-4 py-3 font-semibold"
					>
						Cancel
					</button>

					{sentryRunning && (
						<button
							onClick={() => handleSubmit()}
							disabled={disableButton}
							className={`w-full h-auto bg-[#F30919] text-[15px] border border-[#F30919] text-white px-4 py-3 font-semibold ${disableButton ? "bg-gray-400 border-gray-400 cursor-not-allowed" : ""}`}
						>
							{stopRuntime ?
								<>
									Apply
								</>
								:
								<>
									Loading...
								</>
							}
						</button>
					)}
				</div>
			</div>
		</div>
	);
}



