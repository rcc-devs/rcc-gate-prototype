<template>
  <div>
    <fieldset>
      <legend>Usuários:</legend>

      <form @submit.prevent="check">
        <label for="usernames" :disabled="loading">Usuários (separe-os por barras):</label>
        &nbsp;
        <input type="text" id="usernames" v-model="string" autocomplete="off" />

        <button type="submit">Verificar</button>
      </form>
    </fieldset>

    <fieldset v-show="loaded">
      <legend>Log de Operações:</legend>
      <div v-show="loading">Carregando...<br /></div>

      <ul class="log">
        <li v-for="({ type, message }, index) in logs" :key="index">
          [{{ type }}] {{ message }}
        </li>
      </ul>

      <button @click="logs = []">Limpar Log</button>
    </fieldset>
  </div>
</template>

<script>
import split from '@/Helpers/split-usernames'

export default {
  data () {
    return {
      loading: false,
      loaded: false,
      string: '',
      users: [],
      logs: []
    }
  },
  methods: {
    async check () {
      if (this.loading) return

      this.loading = true
      this.loaded = true
      const users = split(this.string)

      for (const user of users) {
        await this._get(user)
      }

      this.loading = false
    },

    async _get (username) {
      const BASE_URI = 'https://www.habbo.com.br/api/public/users'
      const BADGE_CODE = 'ACH_Name1'

      let userdata, badges

      try {
        const request = await fetch(`${BASE_URI}?name=${username}`)
        userdata = await request.json()
      } catch (e) {
        return this.logs.unshift({
          type: 'WARN', message: `O usuário ${username} não existe.`
        })
      }

      try {
        const request = await fetch(`${BASE_URI}/${userdata.uniqueId}/badges`)
        badges = await request.json()

        if (badges.findIndex(({ code }) => code === BADGE_CODE) === -1) {
          return this.logs.unshift({
            type: 'DANGER', message: `O usuário ${username} é um suspeito: não tem o emblema de nick confirmado.`
          })
        }

        return this.logs.unshift({
          type: 'INFO', message: `O usuário ${username} está limpo.`
        })
      } catch (e) {
        return this.logs.unshift({
          type: 'WARN', message: `O usuário ${username} ativou as opções de privacidade.`
        })
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
