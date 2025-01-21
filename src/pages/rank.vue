<template>
  <div class="rank-container">
    <h1>Leaderboard</h1>
    <div class="ranking-list">
      <div
        v-for="(player, index) in top10"
        :key="index"
        :class="['rank-item', { top3: index < 3 }]"
      >
        <span class="rank">{{ index + 1 }}</span>
        <span class="name">{{ player.name }}</span>
        <span class="score">{{ player.score }}</span>
      </div>
    </div>
    <div class="your-rank">
      <h2>Your Rank</h2>
      <div class="rank-item highlight">
        <span class="rank">{{ yourRank.rank }}</span>
        <span class="name">{{ yourRank.name }}</span>
        <span class="score">{{ yourRank.score }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RankPage',
};
</script>
<script setup>
import { ref } from 'vue';

const top10 = ref([
  { name: 'Alice', score: 200 },
  { name: 'Bob', score: 180 },
  { name: 'Charlie', score: 160 },
  { name: 'Dave', score: 140 },
  { name: 'Eve', score: 120 },
  { name: 'Frank', score: 100 },
  { name: 'Grace', score: 80 },
  { name: 'Hank', score: 60 },
  { name: 'Ivy', score: 40 },
  { name: 'Jack', score: 20 },
]);

const yourRank = ref({ rank: 15, name: 'You', score: 50 });
</script>

<style>
.rank-container {
  text-align: center;
  padding: 20px;
  font-family: Arial, sans-serif;
  color: #333;
}
.ranking-list {
  margin-top: 20px;
}
.rank-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
.rank-item.top3 {
  font-weight: bold;
  color: #f39c12;
}
.rank-item.highlight {
  font-weight: bold;
  color: #27ae60;
  background: #ecf0f1;
}
.rank {
  font-size: 1.2rem;
}
.name {
  flex: 1;
  text-align: left;
  margin-left: 10px;
}
.score {
  font-size: 1.2rem;
}
.your-rank {
  margin-top: 40px;
}
</style>
