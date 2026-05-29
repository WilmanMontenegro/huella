/**
 * Registra el lote demo en Polygon Amoy con 4 etapas de trazabilidad.
 * Uso: pnpm blockchain:register-demo
 */
import { Wallet, JsonRpcProvider, keccak256, toUtf8Bytes, ContractFactory, Contract } from "ethers";
import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const DEMO_LOT_ID = "finca-la-esperanza";
const RPC = process.env.POLYGON_AMOY_RPC_URL ?? "https://rpc-amoy.polygon.technology";
const OUT_PATH = path.join(process.cwd(), "src/data/blockchain/demo-lot-registration.json");

const STEPS = [
  { index: 0, stage: "Cosecha", description: "Cerezas recolectadas a mano y seleccionadas por madurez óptima." },
  { index: 1, stage: "Lavado y fermentación", description: "Proceso húmedo tradicional para resaltar la acidez brillante." },
  { index: 2, stage: "Secado al sol", description: "Reposo en camas elevadas hasta alcanzar la humedad ideal." },
  { index: 3, stage: "Listo para exportación", description: "Control de calidad final y preparación para el envío." },
];

function stepHash(lotId: string, stage: string, description: string): string {
  return keccak256(toUtf8Bytes(`${lotId}|${stage}|${description}`));
}

function lotHash(lotId: string, farmName: string, product: string): string {
  return keccak256(toUtf8Bytes(`${lotId}|${farmName}|${product}|magtrace-v1`));
}

async function loadArtifact() {
  const artifactPath = path.join(
    process.cwd(),
    "blockchain/artifacts/contracts/MagTraceRegistry.sol/MagTraceRegistry.json"
  );
  if (!fs.existsSync(artifactPath)) {
    throw new Error("Contrato no compilado. Ejecuta: pnpm blockchain:compile");
  }
  return JSON.parse(fs.readFileSync(artifactPath, "utf8"));
}

async function main() {
  const pk = process.env.WALLET_PRIVATE_KEY;
  if (!pk) {
    const w = Wallet.createRandom();
    console.error("\n❌ Falta WALLET_PRIVATE_KEY en .env.local");
    console.error(`   Wallet nueva (fúndela en https://faucet.polygon.technology/):`);
    console.error(`   Address: ${w.address}`);
    console.error(`   Private key: ${w.privateKey}\n`);
    process.exit(1);
  }

  const provider = new JsonRpcProvider(RPC);
  const wallet = new Wallet(pk, provider);
  const balance = await provider.getBalance(wallet.address);
  console.log(`Wallet: ${wallet.address}`);
  console.log(`Balance: ${(Number(balance) / 1e18).toFixed(4)} POL`);

  if (balance === 0n) {
    console.error("\n❌ Sin POL en Amoy. Fondea en https://faucet.polygon.technology/\n");
    process.exit(1);
  }

  const artifact = await loadArtifact();
  let contractAddress =
    process.env.NEXT_PUBLIC_HUELLAS_CONTRACT_ADDRESS ??
    process.env.NEXT_PUBLIC_MAGTRACE_CONTRACT_ADDRESS;

  if (!contractAddress) {
    console.log("Desplegando contrato MagTraceRegistry...");
    const factory = new ContractFactory(artifact.abi, artifact.bytecode, wallet);
    const contract = await factory.deploy();
    await contract.waitForDeployment();
    contractAddress = await contract.getAddress();
    console.log(`Contrato desplegado: ${contractAddress}`);
  } else {
    console.log(`Usando contrato existente: ${contractAddress}`);
  }

  const contract = new Contract(contractAddress!, artifact.abi, wallet);

  const farmName = "Finca La Esperanza";
  const product = "Café Castillo";
  const rootHash = lotHash(DEMO_LOT_ID, farmName, product);

  console.log("Registrando lote...");
  const regTx = await contract.registerLot(DEMO_LOT_ID, rootHash, farmName, product);
  const regReceipt = await regTx.wait();
  console.log(`  LotRegistered tx: ${regReceipt?.hash}`);

  const stepTxs: { index: number; stage: string; tx: string }[] = [];

  for (const step of STEPS) {
    console.log(`Registrando paso ${step.index}: ${step.stage}...`);
    const hash = stepHash(DEMO_LOT_ID, step.stage, step.description);
    const tx = await contract.recordStep(DEMO_LOT_ID, step.index, step.stage, hash);
    const receipt = await tx.wait();
    stepTxs.push({ index: step.index, stage: step.stage, tx: receipt!.hash });
    console.log(`  tx: ${receipt?.hash}`);
  }

  const output = {
    network: "polygon-amoy",
    chainId: 80002,
    contractAddress,
    lotId: DEMO_LOT_ID,
    registrationTx: regReceipt?.hash,
    lotDataHash: rootHash,
    steps: stepTxs,
    registeredAt: new Date().toISOString(),
    explorerBase: "https://amoy.polygonscan.com",
  };

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2));
  console.log(`\n✅ Guardado en ${OUT_PATH}`);
  console.log(`Ver lote: https://amoy.polygonscan.com/tx/${regReceipt?.hash}\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
