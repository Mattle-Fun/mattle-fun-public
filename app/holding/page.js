'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, message, Progress, Row, Col, Spin } from 'antd';
import { getHoldingList, claimReward } from './server';
import { usePrivy } from "@privy-io/react-auth";
import { BONUS_HOLDING_LEVELS } from '../constants';

const { Title } = Typography;

export default function HoldingPage() {
	const { user } = usePrivy();
	const wallet = user?.wallet;
	const [holdingData, setHoldingData] = useState({});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (wallet?.address) {
			fetchHoldingData();
		}
	}, [wallet?.address]);

	const fetchHoldingData = async () => {
		setLoading(true);
		try {
			const data = await getHoldingList(wallet?.address);
			if (data.success) {
				setHoldingData(data.holdingData);
			} else {
				message.error('Failed to fetch holding data');
			}
		} catch (error) {
			message.error('Error fetching holding data');
		} finally {
			setLoading(false);
		}
	};

	const handleClaimReward = async (token, level) => {
		if (!wallet?.address) {
			message.error('Please connect your wallet first');
			return;
		}

		setLoading(true);

		try {
			const result = await claimReward(wallet.address, token, String(level));
			if (result.success) {
				message.success(result.message);
				await fetchHoldingData(); // Refresh data after successful claim
			} else {
				message.error(result.message);
			}
		} catch (error) {
			message.error('Failed to claim reward');
		} finally {
			setLoading(false);
		}
	};

	const renderLevelCard = (token, levelData) => {
		const { threshold, energy, points } = BONUS_HOLDING_LEVELS[levelData.level - 1];
		const isMetCondition = levelData?.metCondition;
		const isClaimed = levelData?.claimed;

		return (
			<Col key={levelData.level} span={8}>
				<Card className="h-full">
					<Space direction="vertical" size="small" className="w-full">
						<Title level={4} className="text-center">Level {levelData.level}</Title>
						<Progress
							percent={isMetCondition || isClaimed ? 100 : 0}
							status={isMetCondition || isClaimed ? "success" : "active"}
							showInfo={false}
						/>
						<div className="text-center">
							<p>Hold ${threshold} to get:</p>
							<p className="text-green-500">+{energy} Energy</p>
							<p className="text-blue-500">+{points} Points</p>
						</div>
						<Button
							type="primary"
							block
							onClick={() => handleClaimReward(token, levelData.level)}
							disabled={!isMetCondition || isClaimed}
							loading={loading}
						>
							{isClaimed ? 'Claimed' : isMetCondition ? 'Claim' : 'Not Eligible'}
						</Button>
					</Space>
				</Card>
			</Col>
		);
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Spin size="large" />
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4 space-y-6">
			<Title level={2}>Holding Rewards</Title>
			{Object.keys(holdingData).length === 0 ? (
				<Card>
					<p className="text-center text-gray-500">No holding data available</p>
				</Card>
			) : (
				Object.entries(holdingData).map(([token, holdingData]) => (
					<Card key={token} className="mb-4">
						<Space direction="vertical" size="large" className="w-full">
							<Title level={3}>{holdingData.symbol}</Title>
							<Row gutter={[16, 16]}>
								{holdingData.levels.map((levelData) =>
									renderLevelCard(token, levelData)
								)}
							</Row>
						</Space>
					</Card>
				))
			)}
		</div>
	);
} 