/* ========================================
   DETECTOR DE IA - SCRIPT COMPLETO
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todos los módulos
    CookieManager.init();
    MobileMenu.init();
    StatsCounter.init();
    Detector.init();
    Humanizer.init();
    FAQ.init();
    SmoothScroll.init();
});

/* ========================================
   COOKIE MANAGER
   ======================================== */
const CookieManager = {
    init() {
        this.banner = document.getElementById('cookie-banner');
        this.acceptBtn = document.getElementById('accept-cookies');
        this.rejectBtn = document.getElementById('reject-cookies');
        
        // Verificar si ya hay preferencias guardadas
        if (!this.getCookie('cookie_consent')) {
            this.showBanner();
        } else {
            // Si ya aceptó, cargar scripts de terceros
            if (this.getCookie('cookie_consent') === 'accepted') {
                this.loadThirdPartyScripts();
            }
        }
        
        this.bindEvents();
    },
    
    bindEvents() {
        if (this.acceptBtn) {
            this.acceptBtn.addEventListener('click', () => this.acceptCookies());
        }
        if (this.rejectBtn) {
            this.rejectBtn.addEventListener('click', () => this.rejectCookies());
        }
    },
    
    showBanner() {
        setTimeout(() => {
            if (this.banner) {
                this.banner.classList.add('show');
            }
        }, 1000);
    },
    
    hideBanner() {
        if (this.banner) {
            this.banner.classList.remove('show');
        }
    },
    
    acceptCookies() {
        this.setCookie('cookie_consent', 'accepted', 365);
        this.hideBanner();
        this.loadThirdPartyScripts();
        this.showToast('Preferencias de cookies guardadas', 'success');
    },
    
    rejectCookies() {
        this.setCookie('cookie_consent', 'rejected', 365);
        this.hideBanner();
        this.showToast('Preferencias de cookies guardadas', 'success');
    },
    
    setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
    },
    
    getCookie(name) {
        const cookieName = name + "=";
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }
        return null;
    },
    
    loadThirdPartyScripts() {
        // Cargar Google AdSense si el usuario aceptó cookies
        if (this.getCookie('cookie_consent') === 'accepted') {
            // Los anuncios ya están en el HTML, pero podemos inicializarlos
            try {
                (adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.log('AdSense no disponible');
            }
        }
    },
    
    showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

/* ========================================
   MOBILE MENU
   ======================================== */
const MobileMenu = {
    init() {
        this.menuBtn = document.querySelector('.mobile-menu-btn');
        this.navLinks = document.querySelector('.nav-links');
        
        if (this.menuBtn && this.navLinks) {
            this.menuBtn.addEventListener('click', () => this.toggleMenu());
            
            // Cerrar menú al hacer clic en un enlace
            this.navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });
        }
    },
    
    toggleMenu() {
        this.navLinks.classList.toggle('active');
        const icon = this.menuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    },
    
    closeMenu() {
        this.navLinks.classList.remove('active');
        const icon = this.menuBtn.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    }
};

/* ========================================
   STATS COUNTER ANIMATION
   ======================================== */
const StatsCounter = {
    init() {
        this.stats = document.querySelectorAll('.stat-number');
        this.observed = false;
        
        if (this.stats.length > 0) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.observed) {
                        this.observed = true;
                        this.animateCounters();
                    }
                });
            }, { threshold: 0.5 });
            
            const statsSection = document.querySelector('.stats-section');
            if (statsSection) {
                this.observer.observe(statsSection);
            }
        }
    },
    
    animateCounters() {
        this.stats.forEach(stat => {
            const target = parseFloat(stat.dataset.count);
            const duration = 2000;
            const start = 0;
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = start + (target - start) * easeOutQuart;
                
                if (target >= 1000000) {
                    stat.textContent = (current / 1000000).toFixed(1) + 'M';
                } else if (target >= 1000) {
                    stat.textContent = Math.floor(current).toLocaleString();
                } else if (target < 100) {
                    stat.textContent = current.toFixed(1);
                } else {
                    stat.textContent = Math.floor(current);
                }
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            requestAnimationFrame(animate);
        });
    }
};

/* ========================================
   DETECTOR DE IA
   ======================================== */
const Detector = {
    // Patrones típicos de cada modelo de IA
    patterns: {
        chatgpt: [
            'en conclusión', 'en resumen', 'cabe destacar', 'es importante mencionar',
            'por lo tanto', 'sin embargo', 'no obstante', 'además', 'por otro lado',
            'como se puede observar', 'en primer lugar', 'en segundo lugar',
            'vale la pena mencionar', 'es fundamental', 'cabe señalar',
            'en términos generales', 'desde una perspectiva', 'hay que tener en cuenta',
            'como hemos visto', 'para concluir', 'en definitiva'
        ],
        gemini: [
            'es importante tener en cuenta', 'hay que considerar', 'por consiguiente',
            'así pues', 'de esta manera', 'de tal forma que', 'con el fin de',
            'con el objetivo de', 'con el propósito de', 'dado que', 'visto que',
            'considerando que', 'teniendo en cuenta que', 'a fin de que',
            'de modo que', 'tal manera que', 'ya que', 'puesto que'
        ],
        grok: [
            'básicamente', 'fundamentalmente', 'esencialmente', 'en esencia',
            'dicho de otra manera', 'en otras palabras', 'o sea que',
            'esto significa que', 'lo que implica', 'por decirlo de algún modo',
            'si se quiere', 'en cierto modo', 'hasta cierto punto'
        ],
        claude: [
            'me gustaría', 'quisiera señalar', 'es relevante', 'resulta interesante',
            'llama la atención', 'es digno de mención', 'merece la pena',
            'es conveniente', 'resulta apropiado', 'parece pertinente',
            'considero que', 'a mi juicio', 'a mi entender', 'en mi opinión'
        ],
        general: [
            'asimismo', 'igualmente', 'del mismo modo', 'de la misma forma',
            'por el contrario', 'a diferencia de', 'en cambio', 'por el contrario',
            'no solo', 'sino también', 'tanto como', 'ya sea', 'bien sea',
            'ya que', 'debido a que', 'gracias a', 'por causa de',
            'con el propósito de', 'con la finalidad de', 'con la intención de'
        ]
    },
    
    // Vocabulario típico de IA
    aiVocabulary: [
        'implementar', 'optimizar', 'potenciar', 'maximizar', 'minimizar',
        'sinergia', 'paradigma', 'proactivo', 'holístico', 'integral',
        'innovador', 'disruptivo', 'escalable', 'sostenible', 'resiliente',
        'transformar', 'revolucionar', 'potenciar', 'impulsar', 'fomentar',
        'promover', 'desarrollar', 'establecer', 'generar', 'facilitar',
        'abordar', 'analizar', 'evaluar', 'considerar', 'examinar',
        'comprehensive', 'robust', 'seamless', 'cutting-edge', 'state-of-the-art'
    ],
    
    init() {
        this.textarea = document.getElementById('detector-textarea');
        this.analyzeBtn = document.getElementById('analyze-btn');
        this.resultDiv = document.getElementById('detector-result');
        this.charCount = document.getElementById('char-count');
        this.wordCount = document.getElementById('word-count');
        
        if (this.textarea && this.analyzeBtn) {
            this.textarea.addEventListener('input', () => this.updateCounts());
            this.analyzeBtn.addEventListener('click', () => this.analyze());
        }
    },
    
    updateCounts() {
        const text = this.textarea.value;
        const chars = text.length;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        
        this.charCount.textContent = `${chars} caracteres`;
        this.wordCount.textContent = `${words} palabras`;
    },
    
    analyze() {
        const text = this.textarea.value.trim();
        
        if (text.length < 50) {
            CookieManager.showToast('El texto debe tener al menos 50 caracteres', 'error');
            return;
        }
        
        // Mostrar estado de carga
        this.analyzeBtn.classList.add('loading');
        this.analyzeBtn.disabled = true;
        this.analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analizando...';
        
        // Simular tiempo de análisis
        setTimeout(() => {
            const result = this.performAnalysis(text);
            this.displayResult(result);
            
            this.analyzeBtn.classList.remove('loading');
            this.analyzeBtn.disabled = false;
            this.analyzeBtn.innerHTML = '<i class="fas fa-search"></i> Analizar texto';
        }, 1500);
    },
    
    performAnalysis(text) {
        const lowerText = text.toLowerCase();
        const words = lowerText.split(/\s+/);
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        
        // Calcular métricas
        const vocabScore = this.analyzeVocabulary(lowerText);
        const structureScore = this.analyzeStructure(sentences);
        const connectorsScore = this.analyzeConnectors(lowerText);
        const repetitionScore = this.analyzeRepetition(words);
        
        // Detectar modelo probable
        const modelDetected = this.detectModel(lowerText);
        
        // Calcular puntuación total
        const totalScore = (vocabScore * 0.3 + structureScore * 0.25 + 
                          connectorsScore * 0.25 + repetitionScore * 0.2);
        
        // Determinar resultado
        let verdict, verdictClass;
        if (totalScore < 30) {
            verdict = 'Texto probablemente humano';
            verdictClass = 'human';
        } else if (totalScore < 60) {
            verdict = 'Texto mixto o editado';
            verdictClass = 'mixed';
        } else {
            verdict = 'Texto probablemente generado por IA';
            verdictClass = 'ai';
        }
        
        return {
            score: Math.round(totalScore),
            verdict,
            verdictClass,
            modelDetected,
            vocabScore,
            structureScore,
            connectorsScore,
            repetitionScore,
            patternsFound: this.countPatterns(lowerText),
            structureAnalysis: this.getStructureAnalysis(sentences)
        };
    },
    
    analyzeVocabulary(text) {
        let score = 0;
        this.aiVocabulary.forEach(word => {
            if (text.includes(word.toLowerCase())) {
                score += 5;
            }
        });
        return Math.min(score, 100);
    },
    
    analyzeStructure(sentences) {
        if (sentences.length < 2) return 50;
        
        // Analizar longitud de oraciones
        const lengths = sentences.map(s => s.trim().split(/\s+/).length);
        const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
        const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / lengths.length;
        
        // La IA tiende a producir oraciones de longitud similar
        let score = 0;
        if (variance < 50) score += 30;
        if (variance < 100) score += 20;
        if (avgLength > 15 && avgLength < 30) score += 25;
        
        return Math.min(score, 100);
    },
    
    analyzeConnectors(text) {
        let count = 0;
        const allPatterns = [
            ...this.patterns.chatgpt,
            ...this.patterns.gemini,
            ...this.patterns.grok,
            ...this.patterns.claude,
            ...this.patterns.general
        ];
        
        allPatterns.forEach(pattern => {
            const regex = new RegExp(pattern, 'gi');
            const matches = text.match(regex);
            if (matches) {
                count += matches.length * 3;
            }
        });
        
        return Math.min(count, 100);
    },
    
    analyzeRepetition(words) {
        const wordFreq = {};
        words.forEach(word => {
            if (word.length > 3) {
                wordFreq[word] = (wordFreq[word] || 0) + 1;
            }
        });
        
        const repeatedWords = Object.values(wordFreq).filter(count => count > 2).length;
        const uniqueWords = Object.keys(wordFreq).length;
        
        // Alta repetición puede indicar IA
        const repetitionRatio = repeatedWords / uniqueWords;
        return Math.min(repetitionRatio * 200, 100);
    },
    
    detectModel(text) {
        const scores = {};
        
        Object.keys(this.patterns).forEach(model => {
            let score = 0;
            this.patterns[model].forEach(pattern => {
                if (text.includes(pattern)) {
                    score++;
                }
            });
            scores[model] = score;
        });
        
        const maxModel = Object.keys(scores).reduce((a, b) => 
            scores[a] > scores[b] ? a : b
        );
        
        const modelNames = {
            chatgpt: 'ChatGPT / GPT-4',
            gemini: 'Google Gemini',
            grok: 'Grok (xAI)',
            claude: 'Anthropic Claude',
            general: 'Modelo de IA genérico'
        };
        
        return scores[maxModel] > 0 ? modelNames[maxModel] : 'No detectado';
    },
    
    countPatterns(text) {
        let count = 0;
        Object.values(this.patterns).forEach(patterns => {
            patterns.forEach(pattern => {
                if (text.includes(pattern)) {
                    count++;
                }
            });
        });
        return count;
    },
    
    getStructureAnalysis(sentences) {
        if (sentences.length < 3) return 'Insuficiente para análisis';
        
        const avgLength = sentences.reduce((sum, s) => 
            sum + s.trim().split(/\s+/).length, 0) / sentences.length;
        
        if (avgLength > 25) return 'Oraciones largas y formales';
        if (avgLength > 15) return 'Estructura equilibrada';
        return 'Oraciones cortas y directas';
    },
    
    displayResult(result) {
        this.resultDiv.classList.remove('hidden');
        
        // Actualizar icono y título
        const resultIcon = this.resultDiv.querySelector('.result-icon');
        const resultTitle = this.resultDiv.querySelector('.result-title');
        
        resultIcon.className = `result-icon ${result.verdictClass}`;
        resultTitle.className = `result-title ${result.verdictClass}`;
        resultTitle.textContent = result.verdict;
        
        // Actualizar puntuación circular
        const scoreFill = this.resultDiv.querySelector('.score-fill');
        const scoreText = this.resultDiv.querySelector('.score-text');
        
        scoreFill.style.strokeDasharray = `${result.score}, 100`;
        scoreText.textContent = `${result.score}%`;
        
        // Colorear según puntuación
        if (result.score < 30) {
            scoreFill.style.stroke = '#22c55e';
        } else if (result.score < 60) {
            scoreFill.style.stroke = '#f59e0b';
        } else {
            scoreFill.style.stroke = '#ef4444';
        }
        
        // Actualizar detalles
        document.getElementById('model-detected').textContent = result.modelDetected;
        document.getElementById('patterns-found').textContent = `${result.patternsFound} patrones identificados`;
        document.getElementById('structure-analysis').textContent = result.structureAnalysis;
        
        // Actualizar barras de análisis
        this.updateBar('vocab', result.vocabScore);
        this.updateBar('structure', result.structureScore);
        this.updateBar('connectors', result.connectorsScore);
        this.updateBar('repetition', result.repetitionScore);
        
        // Scroll al resultado
        this.resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
    
    updateBar(name, value) {
        const bar = document.getElementById(`${name}-bar`);
        const valueSpan = document.getElementById(`${name}-value`);
        
        if (bar && valueSpan) {
            setTimeout(() => {
                bar.style.width = `${value}%`;
                valueSpan.textContent = `${value}%`;
            }, 100);
        }
    }
};

/* ========================================
   HUMANIZER
   ======================================== */
const Humanizer = {
    init() {
        this.textarea = document.getElementById('humanizer-textarea');
        this.humanizeBtn = document.getElementById('humanize-btn');
        this.resultDiv = document.getElementById('humanizer-result');
        this.humanizedText = document.getElementById('humanized-text');
        this.copyBtn = document.getElementById('copy-result');
        this.rehumanizeBtn = document.getElementById('rehumanize-btn');
        this.checkIaBtn = document.getElementById('check-ia-btn');
        
        // Opciones
        this.optLessFormal = document.getElementById('opt-less-formal');
        this.optSummarize = document.getElementById('opt-summarize');
        this.optTypos = document.getElementById('opt-typos');
        
        if (this.humanizeBtn) {
            this.humanizeBtn.addEventListener('click', () => this.humanize());
        }
        
        if (this.copyBtn) {
            this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        }
        
        if (this.rehumanizeBtn) {
            this.rehumanizeBtn.addEventListener('click', () => this.humanize());
        }
        
        if (this.checkIaBtn) {
            this.checkIaBtn.addEventListener('click', () => this.checkInDetector());
        }
    },
    
    humanize() {
        const text = this.textarea.value.trim();
        
        if (text.length < 20) {
            CookieManager.showToast('El texto debe tener al menos 20 caracteres', 'error');
            return;
        }
        
        // Mostrar carga
        this.humanizeBtn.classList.add('loading');
        this.humanizeBtn.disabled = true;
        this.humanizeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Humanizando...';
        
        setTimeout(() => {
            let result = text;
            
            // Aplicar transformaciones según opciones
            if (this.optLessFormal && this.optLessFormal.checked) {
                result = this.makeLessFormal(result);
            }
            
            if (this.optSummarize && this.optSummarize.checked) {
                result = this.summarize(result);
            }
            
            if (this.optTypos && this.optTypos.checked) {
                result = this.addTypos(result);
            }
            
            // Si no hay opciones seleccionadas, aplicar humanización básica
            if (!this.optLessFormal?.checked && !this.optSummarize?.checked && !this.optTypos?.checked) {
                result = this.basicHumanize(result);
            }
            
            this.displayResult(result);
            
            this.humanizeBtn.classList.remove('loading');
            this.humanizeBtn.disabled = false;
            this.humanizeBtn.innerHTML = '<i class="fas fa-magic"></i> Humanizar texto';
        }, 1200);
    },
    
    basicHumanize(text) {
        let result = text;
        
        // Reemplazar conectores formales
        const replacements = {
            'por lo tanto': 'así que',
            'sin embargo': 'pero',
            'no obstante': 'aunque',
            'en conclusión': 'en fin',
            'en resumen': 'vamos',
            'cabe destacar': 'bueno',
            'es importante mencionar': 'ojo que',
            'en primer lugar': 'primero',
            'en segundo lugar': 'luego',
            'por consiguiente': 'entonces',
            'asimismo': 'también',
            'por otro lado': 'por otra parte',
            'además': 'y también',
            'en términos generales': 'más o menos',
            'como se puede observar': 'se ve que',
            'es fundamental': 'es clave',
            'cabe señalar': 'hay que decir',
            'en definitiva': 'al final'
        };
        
        Object.keys(replacements).forEach(formal => {
            const regex = new RegExp(formal, 'gi');
            result = result.replace(regex, replacements[formal]);
        });
        
        // Añadir variación en longitud de oraciones
        result = this.varySentenceLength(result);
        
        return result;
    },
    
    makeLessFormal(text) {
        let result = this.basicHumanize(text);
        
        // Hacer más coloquial
        const colloquialisms = {
            'implementar': 'hacer',
            'optimizar': 'mejorar',
            'potenciar': 'subir',
            'maximizar': 'subir al máximo',
            'minimizar': 'bajar',
            'analizar': 'mirar',
            'evaluar': 'ver',
            'considerar': 'pensar',
            'establecer': 'poner',
            'generar': 'crear',
            'facilitar': 'hacer más fácil',
            'abordar': 'tratar',
            'promover': 'animar',
            'fomentar': 'apoyar',
            'desarrollar': 'hacer'
        };
        
        Object.keys(colloquialisms).forEach(formal => {
            const regex = new RegExp(`\\b${formal}\\b`, 'gi');
            result = result.replace(regex, colloquialisms[formal]);
        });
        
        // Quitar puntuación extra
        result = result.replace(/,\s*,/g, ',');
        result = result.replace(/\.\s*\./g, '.');
        
        // Añadir expresiones juveniles ocasionalmente
        const expressions = ['bueno', 'pues', 'vaya', 'mira', 'o sea'];
        const sentences = result.split('. ');
        
        if (sentences.length > 2) {
            const randomIndex = Math.floor(Math.random() * (sentences.length - 1)) + 1;
            const randomExpr = expressions[Math.floor(Math.random() * expressions.length)];
            sentences[randomIndex] = randomExpr + ', ' + sentences[randomIndex].toLowerCase();
            result = sentences.join('. ');
        }
        
        return result;
    },
    
    summarize(text) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        
        if (sentences.length <= 3) {
            return text;
        }
        
        // Seleccionar las oraciones más importantes (primera, última, y algunas del medio)
        const importantIndices = [0];
        
        // Añadir oraciones del medio que contengan palabras clave
        const keywords = ['importante', 'clave', 'esencial', 'fundamental', 'principal', 'conclusión'];
        sentences.forEach((sentence, index) => {
            if (index > 0 && index < sentences.length - 1) {
                if (keywords.some(kw => sentence.toLowerCase().includes(kw))) {
                    importantIndices.push(index);
                }
            }
        });
        
        // Añadir la última oración
        importantIndices.push(sentences.length - 1);
        
        // Eliminar duplicados y ordenar
        const uniqueIndices = [...new Set(importantIndices)].sort((a, b) => a - b);
        
        // Construir resumen
        const summary = uniqueIndices.map(i => sentences[i].trim()).join('. ');
        return summary + '.';
    },
    
    addTypos(text) {
        let result = text;
        
        // Errores ortográficos comunes
        const typos = [
            { from: 'que', to: 'q' },
            { from: 'porque', to: 'xq' },
            { from: 'para', to: 'pa' },
            { from: 'todo', to: 'to' },
            { from: 'está', to: 'sta' },
            { from: 'también', to: 'tb' },
            { from: 'muy', to: 'mu' },
            { from: 'hacer', to: 'acer' }
        ];
        
        // Aplicar algunos errores aleatoriamente (no todos)
        const shuffled = typos.sort(() => Math.random() - 0.5);
        const selectedTypos = shuffled.slice(0, Math.min(3, shuffled.length));
        
        selectedTypos.forEach(typo => {
            // Solo reemplazar algunas ocurrencias
            const regex = new RegExp(`\\b${typo.from}\\b`, 'gi');
            const matches = result.match(regex);
            
            if (matches && matches.length > 0) {
                const randomMatch = Math.floor(Math.random() * matches.length);
                let count = 0;
                result = result.replace(regex, (match) => {
                    if (count === randomMatch) {
                        count++;
                        return typo.to;
                    }
                    count++;
                    return match;
                });
            }
        });
        
        // Añadir alguna falta de acento
        const accents = [
            { from: 'está', to: 'esta' },
            { from: 'también', to: 'tambien' },
            { from: 'información', to: 'informacion' },
            { from: 'importante', to: 'importante' },
            { from: 'más', to: 'mas' },
            { from: 'sólo', to: 'solo' }
        ];
        
        const randomAccent = accents[Math.floor(Math.random() * accents.length)];
        result = result.replace(new RegExp(randomAccent.from, 'gi'), randomAccent.to);
        
        return result;
    },
    
    varySentenceLength(text) {
        const sentences = text.split('. ').filter(s => s.trim().length > 0);
        
        // Mezclar oraciones largas con cortas
        const result = sentences.map((sentence, index) => {
            // Aleatoriamente hacer algunas oraciones más cortas
            if (index > 0 && Math.random() > 0.7) {
                const words = sentence.split(' ');
                if (words.length > 8) {
                    return words.slice(0, Math.floor(words.length * 0.6)).join(' ');
                }
            }
            return sentence;
        });
        
        return result.join('. ');
    },
    
    displayResult(text) {
        this.humanizedText.textContent = text;
        this.resultDiv.classList.remove('hidden');
        this.resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
    
    copyToClipboard() {
        const text = this.humanizedText.textContent;
        navigator.clipboard.writeText(text).then(() => {
            CookieManager.showToast('Texto copiado al portapapeles', 'success');
        }).catch(() => {
            CookieManager.showToast('Error al copiar el texto', 'error');
        });
    },
    
    checkInDetector() {
        const text = this.humanizedText.textContent;
        
        // Ir al detector y pegar el texto
        const detectorTextarea = document.getElementById('detector-textarea');
        if (detectorTextarea) {
            detectorTextarea.value = text;
            detectorTextarea.dispatchEvent(new Event('input'));
            
            document.getElementById('detector').scrollIntoView({ behavior: 'smooth' });
        }
    }
};

/* ========================================
   FAQ ACCORDION
   ======================================== */
const FAQ = {
    init() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            if (question) {
                question.addEventListener('click', () => {
                    // Cerrar otros items
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });
                    
                    // Toggle item actual
                    item.classList.toggle('active');
                });
            }
        });
    }
};

/* ========================================
   SMOOTH SCROLL
   ======================================== */
const SmoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
};