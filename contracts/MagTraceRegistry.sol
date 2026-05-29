// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title MagTraceRegistry — trazabilidad de lotes agro-turísticos (Polygon Amoy)
contract MagTraceRegistry {
    event LotRegistered(
        string indexed lotId,
        bytes32 dataHash,
        string farmName,
        string product,
        uint256 timestamp
    );

    event TraceabilityStepRecorded(
        string indexed lotId,
        uint256 stepIndex,
        string stage,
        bytes32 stepHash,
        uint256 timestamp
    );

    mapping(string => bytes32) public lotHashes;
    mapping(string => uint256) public stepCounts;

    function registerLot(
        string calldata lotId,
        bytes32 dataHash,
        string calldata farmName,
        string calldata product
    ) external {
        lotHashes[lotId] = dataHash;
        emit LotRegistered(lotId, dataHash, farmName, product, block.timestamp);
    }

    function recordStep(
        string calldata lotId,
        uint256 stepIndex,
        string calldata stage,
        bytes32 stepHash
    ) external {
        stepCounts[lotId] = stepIndex + 1;
        emit TraceabilityStepRecorded(lotId, stepIndex, stage, stepHash, block.timestamp);
    }
}
