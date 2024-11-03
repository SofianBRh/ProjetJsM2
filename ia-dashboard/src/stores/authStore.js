// src/stores/authStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)

  // Fonction utilitaire pour définir un cookie avec tous les attributs de sécurité
  const setCookie = (name, value, options = {}) => {
    const defaults = {
      path: '/',
      secure: true,
      sameSite: 'Lax',
      maxAge: 86400 // 24 heures en secondes
    }
    
    const cookieOptions = { ...defaults, ...options }
    
    let cookieString = `${name}=${encodeURIComponent(value)}`
    
    if (cookieOptions.path) {
      cookieString += `; path=${cookieOptions.path}`
    }
    if (cookieOptions.maxAge) {
      cookieString += `; max-age=${cookieOptions.maxAge}`
    }
    if (cookieOptions.secure) {
      cookieString += '; secure'
    }
    if (cookieOptions.sameSite) {
      cookieString += `; samesite=${cookieOptions.sameSite}`
    }
    if (cookieOptions.domain) {
      cookieString += `; domain=${cookieOptions.domain}`
    }
    
    document.cookie = cookieString
  }

  // Fonction utilitaire pour obtenir un cookie
  const getCookie = (name) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return parts.pop().split(';').shift()
    }
    return null
  }

  // Fonction utilitaire pour supprimer un cookie
  const deleteCookie = (name) => {
    setCookie(name, '', { maxAge: -1 })
  }

  // Initialiser l'état depuis les cookies
  const initializeFromCookies = () => {
    const userCookie = getCookie('user')
    
    if (userCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie))
        user.value = userData
        isAuthenticated.value = true
      } catch (e) {
        console.error('Error parsing user cookie:', e)
        // En cas d'erreur, nettoyer le cookie invalide
        deleteCookie('user')
      }
    }
  }

  // Login avec gestion des cookies sécurisés
  const login = (userData) => {
    user.value = userData
    isAuthenticated.value = true
    
    // Sauvegarder dans les cookies avec les attributs de sécurité appropriés
    setCookie('user', JSON.stringify(userData), {
      maxAge: 86400, // 24 heures
      sameSite: 'Lax',
      secure: true,
      path: '/'
    })
  }

  // Logout avec nettoyage sécurisé des cookies
  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    deleteCookie('user')
  }

  // Vérifier si l'utilisateur est authentifié
  const checkAuth = () => {
    return isAuthenticated.value
  }

  // Obtenir le token ou les informations d'utilisateur si nécessaire
  const getUserInfo = () => {
    return user.value
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    getUserInfo,
    initializeFromCookies
  }
})