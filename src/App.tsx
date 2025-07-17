import QRCodeStyling, {
	type CornerDotType,
	type CornerSquareType,
	type DotType,
} from "qr-code-styling";
import { type FormEvent, useEffect, useRef } from "react";

export default function App() {
	const containerRef = useRef<HTMLDivElement>(null);
	const qrRef = useRef<QRCodeStyling>(null);

	const handleGenerateQRCode = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = new FormData(e.currentTarget);

		const data = form.get("url")?.toString() ?? "";
		const dotType = form.get("dotType") as DotType;
		const dotColor = form.get("dotColor")?.toString() ?? "#000000";
		const borderType = form.get("borderType") as CornerSquareType;
		const borderColor = form.get("borderColor")?.toString() ?? "#000000";
		const innerType = form.get("innerType") as CornerDotType;
		const innerColor = form.get("innerColor")?.toString() ?? "#000000";
		const backgroundColor =
			form.get("backgroundColor")?.toString() ?? "#ffffff";

		const file = form.get("logo");
		let imageUrl: string | undefined;

		if (file instanceof File && file.size > 0) {
			imageUrl = await new Promise<string>((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(reader.result as string);
				reader.onerror = () => reject(reader.error);
				reader.readAsDataURL(file);
			});
		}

		qrRef.current?.update({
			data,
			dotsOptions: { type: dotType, color: dotColor },
			cornersSquareOptions: { type: borderType, color: borderColor },
			cornersDotOptions: { type: innerType, color: innerColor },
			backgroundOptions: { color: backgroundColor },
			image: imageUrl,
			imageOptions: {
				margin: 5,
				hideBackgroundDots: true,
			},
		});
	};

	const handleDownload = () => {
		qrRef.current?.download();
	};

	useEffect(() => {
		qrRef.current = new QRCodeStyling({
			width: 256,
			height: 256,
			data: "",
			dotsOptions: { type: "square", color: "#000000" },
			cornersSquareOptions: { type: "square", color: "#000000" },
			cornersDotOptions: { type: "square", color: "#000000" },
			margin: 2,
		});
		if (containerRef.current) {
			qrRef.current.append(containerRef.current);
		}
	}, []);

	return (
		<div className="bg-rose-900 h-screen w-screen p-8 flex flex-col items-center justify-center">
			<div className="min-w-[50vw] bg-gray-100 backdrop-blur-2xl border border-white/40 p-4 rounded-2xl shadow-lg overflow-y-auto">
				<div className="flex items-baseline justify-between">
					<h1 className="font-bold text-2xl mb-4 self-start">
						Gerador de QR Code
					</h1>

					<button
						type="button"
						onClick={handleDownload}
						className="px-2 py-1 rounded-md cursor-pointer bg-rose-400 hover:bg-rose-500 transition-all duration-300 ease-in-out font-semibold text-gray-100"
					>
						Baixar
					</button>
				</div>

				<div className="grid md:grid-cols-2 gap-2 w-full">
					<form
						onSubmit={handleGenerateQRCode}
						className="flex flex-col gap-2 h-full"
					>
						<textarea
							id="url"
							name="url"
							rows={3}
							className="resize-none outline-none p-2 rounded-md placeholder:text-gray-400 placeholder:font-light text-gray-600 font-lg"
							placeholder="Digite seu texto"
						/>

						<fieldset className="grid grid-cols-2 gap-4">
							<legend className="col-span-2 font-semibold">Pontos</legend>
							<select
								name="dotType"
								defaultValue="square"
								className="border px-2 py-1 border-gray-300 rounded-md"
							>
								<option value="dots">Ponto</option>
								<option value="rounded">Levemente arredondado</option>
								<option value="extra-rounded">Arredondado</option>
								<option value="classy">Classy</option>
								<option value="classy-rounded">Classy arredondado</option>
								<option value="square">Quadrado</option>
							</select>
							<input type="color" name="dotColor" defaultValue="#000000" />
						</fieldset>

						<fieldset className="grid grid-cols-2 gap-4">
							<legend className="col-span-2 font-semibold">
								Quadro Externo
							</legend>
							<select
								name="borderType"
								defaultValue="square"
								className="border px-2 py-1 border-gray-300 rounded-md"
							>
								<option value="rounded">Levemente arredondado</option>
								<option value="extra-rounded">Arredondado</option>
								<option value="dot">Circular</option>
								<option value="square">Quadrado</option>
							</select>
							<input type="color" name="borderColor" defaultValue="#000000" />
						</fieldset>

						<fieldset className="grid grid-cols-2 gap-4">
							<legend className="col-span-2 font-semibold">
								Quadro Interno
							</legend>
							<select
								name="innerType"
								defaultValue="square"
								className="border px-2 py-1 border-gray-300 rounded-md"
							>
								<option value="rounded">Levemente arredondado</option>
								<option value="extra-rounded">Arredondado</option>
								<option value="dot">Circular</option>
								<option value="square">Quadrado</option>
							</select>
							<input type="color" name="innerColor" defaultValue="#000000" />
						</fieldset>

						<fieldset>
							<legend className="font-semibold">Cor de fundo</legend>
							<input
								type="color"
								name="backgroundColor"
								defaultValue="#ffffff"
							/>
						</fieldset>

						<fieldset>
							<legend className="font-semibold">Imagem central</legend>
							<input
								type="file"
								name="logo"
								accept="image/*"
								className="border px-2 py-1 border-gray-300 rounded-md"
							/>
						</fieldset>

						<button
							type="submit"
							className="mt-auto cursor-pointer bg-rose-400 hover:bg-rose-500 transition-colors ease-in-out duration-200 text-white font-semibold py-2 rounded-md	"
						>
							Gerar QR Code
						</button>
					</form>

					<div className="w-full h-full flex items-center justify-center md:items-start">
						<div
							ref={containerRef}
							className="w-2xs h-2xs aspect-square flex items-center justify-center"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
