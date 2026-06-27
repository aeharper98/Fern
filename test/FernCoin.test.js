const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FernCoin ($FERN)", function () {
  const ONE_BILLION = ethers.parseEther("1000000000");

  async function deploy() {
    const [deployer, alice, bob] = await ethers.getSigners();
    const FernCoin = await ethers.getContractFactory("FernCoin");
    const fern = await FernCoin.deploy(deployer.address);
    await fern.waitForDeployment();
    return { fern, deployer, alice, bob };
  }

  describe("metadata", function () {
    it("has the right name, symbol and decimals", async function () {
      const { fern } = await deploy();
      expect(await fern.name()).to.equal("Fern Coin");
      expect(await fern.symbol()).to.equal("FERN");
      expect(await fern.decimals()).to.equal(18);
    });
  });

  describe("supply", function () {
    it("mints exactly one billion FERN to the initial holder", async function () {
      const { fern, deployer } = await deploy();
      expect(await fern.totalSupply()).to.equal(ONE_BILLION);
      expect(await fern.balanceOf(deployer.address)).to.equal(ONE_BILLION);
      expect(await fern.MAX_SUPPLY()).to.equal(ONE_BILLION);
    });

    it("reverts when deployed to the zero address", async function () {
      const FernCoin = await ethers.getContractFactory("FernCoin");
      await expect(FernCoin.deploy(ethers.ZeroAddress)).to.be.revertedWith(
        "FernCoin: zero holder"
      );
    });

    it("has no mint function (fixed supply, no inflation)", async function () {
      const { fern } = await deploy();
      expect(fern.mint).to.be.undefined;
    });
  });

  describe("transfers", function () {
    it("transfers tokens between accounts", async function () {
      const { fern, deployer, alice } = await deploy();
      const amount = ethers.parseEther("100");
      await fern.transfer(alice.address, amount);
      expect(await fern.balanceOf(alice.address)).to.equal(amount);
    });

    it("reverts when transferring more than the balance", async function () {
      const { fern, alice, bob } = await deploy();
      await expect(
        fern.connect(alice).transfer(bob.address, 1n)
      ).to.be.revertedWithCustomError(fern, "ERC20InsufficientBalance");
    });
  });

  describe("burning", function () {
    it("lets a holder burn their own tokens and reduces supply", async function () {
      const { fern, deployer } = await deploy();
      const burn = ethers.parseEther("500");
      await fern.burn(burn);
      expect(await fern.totalSupply()).to.equal(ONE_BILLION - burn);
      expect(await fern.balanceOf(deployer.address)).to.equal(ONE_BILLION - burn);
    });
  });

  describe("permit (ERC-2612 gasless approvals)", function () {
    it("approves via signature", async function () {
      const { fern, deployer, alice } = await deploy();
      const value = ethers.parseEther("10");
      const deadline = ethers.MaxUint256;
      const nonce = await fern.nonces(deployer.address);

      const domain = {
        name: "Fern Coin",
        version: "1",
        chainId: (await ethers.provider.getNetwork()).chainId,
        verifyingContract: await fern.getAddress(),
      };
      const types = {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      };
      const message = {
        owner: deployer.address,
        spender: alice.address,
        value,
        nonce,
        deadline,
      };

      const signature = await deployer.signTypedData(domain, types, message);
      const { v, r, s } = ethers.Signature.from(signature);

      await fern.permit(deployer.address, alice.address, value, deadline, v, r, s);
      expect(await fern.allowance(deployer.address, alice.address)).to.equal(value);
    });
  });
});
