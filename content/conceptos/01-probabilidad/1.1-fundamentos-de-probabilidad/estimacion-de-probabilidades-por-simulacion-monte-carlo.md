---
id: estimacion-de-probabilidades-por-simulacion-monte-carlo
titulo: Estimación de probabilidades por simulación Monte Carlo
titulo_en: Monte Carlo estimation of probabilities
alias:
  - simulación Monte Carlo
  - método de Monte Carlo
  - estimación por simulación
modulo: 1
submodulo: '1.1'
orden: 13
nivel: basico
prerrequisitos:
  - interpretacion-frecuentista
  - metodo-de-monte-carlo-para-conteo-aproximado
relaciones:
  - tipo: generaliza
    id: estimacion-de-pi-por-monte-carlo
  - tipo: relacionado
    id: aguja-de-buffon
etiquetas:
  - simulación
  - Monte Carlo
  - error estándar
  - intervalo de confianza
resumen: >
  Para estimar la probabilidad de un evento se simula el experimento muchas veces con un generador de
  números aleatorios y se toma la proporción de simulaciones en que ocurre. El error baja como 1/raíz de N.
formula: '\hat{p}_N = \frac{1}{N}\sum_{i=1}^{N} \mathbf{1}\{A \text{ ocurre en la simulación } i\}'
visualizacion:
  componente: SampleSpaceLab
  parametros:
    modo: frecuencia
    experimento: cuatro-dados
    eventoA: al-menos-un-seis
    eventos: [al-menos-un-seis, suma-mayor-17, todos-distintos, suma-14]
    banda: true
    trayectorias: 3
    ensayos: 4000
referencias:
  - clave: murphy
  - clave: ross-procesos
    capitulo: '11'
  - clave: wasserman
publicado: true
---

## Intuición

Algunas probabilidades son difíciles de calcular con fórmulas pero fáciles de simular. Si se quiere saber qué tan probable es que cuatro dados muestren caras todas distintas, se puede razonar con combinatoria, o se le puede pedir a una computadora que lance cuatro dados cien mil veces y cuente. La proporción observada será una buena aproximación de la probabilidad.

Esto es el método de Monte Carlo aplicado a probabilidades: convertir la interpretación frecuentista en un procedimiento de cálculo. Su ventaja es que solo exige poder **simular** el experimento y **reconocer** si el evento ocurrió; no exige resolver ninguna ecuación. Por eso se usa en problemas donde el análisis exacto es inviable, como la probabilidad de que una red eléctrica falle, de que un portafolio pierda más de cierto monto o de que un torneo lo gane cierto equipo.

El precio es la incertidumbre. La estimación cambia de una corrida a otra, y su precisión mejora con lentitud: para ganar un decimal hay que multiplicar las simulaciones por cien. Por eso toda estimación de Monte Carlo debe reportarse con su margen de error.

## Definición

:::definicion[Estimador de Monte Carlo de una probabilidad]
Sean $\omega_1, \dots, \omega_N$ resultados de $N$ simulaciones independientes del experimento. El estimador de $p = P(A)$ es la proporción

$$
\hat{p}_N = \frac{1}{N}\sum_{i=1}^{N} \mathbf{1}\{\omega_i \in A\}.
$$

Es insesgado, $\mathbb{E}[\hat{p}_N] = p$, y su error estándar es $\sqrt{p(1-p)/N}$. Un intervalo aproximado de 95 % es

$$
\hat{p}_N \pm 1.96\sqrt{\frac{\hat{p}_N(1 - \hat{p}_N)}{N}}.
$$

:::

Condiciones: las simulaciones deben ser independientes y reproducir fielmente el experimento, y el intervalo usa la aproximación normal, adecuada cuando $N\hat{p}_N$ y $N(1 - \hat{p}_N)$ superan 10 aproximadamente.

:::figura[Estimación de P(la suma de cuatro dados es 18 o más) por simulación, con la banda de 95 %. El valor exacto, 206/1296 = 0.159, requiere contar con cuidado; la simulación lo aproxima sin ninguna fórmula.]{componente="SampleSpaceLab"}

```yaml
modo: frecuencia
experimento: cuatro-dados
eventoA: suma-mayor-17
eventos: [suma-mayor-17]
banda: true
ensayos: 4000
```

:::

:::nota[Qué significa cada símbolo]

- $A$: evento cuya probabilidad se estima; $p = P(A)$: su probabilidad verdadera.
- $N$: número de simulaciones; $\omega_i$: resultado de la simulación $i$.
- $\mathbf{1}\{\omega_i \in A\}$: indicadora, 1 si en la simulación $i$ ocurrió $A$ y 0 si no.
- $\hat{p}_N$: proporción de simulaciones en que ocurrió $A$, la estimación.
- $\mathbb{E}[\cdot]$: esperanza o valor promedio a la larga.
- $\sqrt{p(1-p)/N}$: error estándar, tamaño típico de $\hat{p}_N - p$.
- $1.96$: factor para un intervalo de 95 %.
- $e$: margen de error deseado al planear el número de simulaciones.
:::

## Cómo usar la visualización

Cada paso simula el lanzamiento de cuatro dados; la rejilla de 1296 resultados se va coloreando según cuántas veces ha salido cada uno y el recuadro marca el último. Tres simulaciones independientes avanzan a la vez. La gráfica muestra la proporción de simulaciones con al menos un 6, junto al valor exacto y la banda de 95 % en la que debe caer la estimación.

Con 100 simulaciones las tres estimaciones pueden diferir en más de 0.1; con 4000, la banda mide cerca de 0.03 y las tres coinciden en el primer decimal. Al cambiar el evento a "los cuatro dados son distintos" la probabilidad exacta es $360/1296 \approx 0.278$. Con "la suma es 14", un evento menos frecuente, la banda relativa es más ancha.

## Ejemplo

El caballero de Méré apostaba a obtener al menos un 6 en cuatro lanzamientos de un dado. Una simulación de $N = 10000$ rondas registra el evento en 5164.

1. Estimación: $\hat{p} = 5164/10000 = 0.5164$.
2. Error estándar estimado: $\sqrt{0.5164 \cdot 0.4836/10000} \approx 0.0050$.
3. Intervalo de 95 %: $0.5164 \pm 0.0098$, es decir, de 0.507 a 0.526.
4. El valor exacto, $1 - (5/6)^4 \approx 0.5177$, está dentro del intervalo.
5. Como el intervalo queda completamente por encima de 0.5, la simulación basta para concluir que la apuesta es favorable.

:::figura[La simulación del ejemplo: 10000 rondas de cuatro dados. La banda de 95 % alrededor del valor exacto 0.5177 queda completamente por encima de la línea fina de 0.5 a partir de unas 3000 rondas, y la estimación termina dentro de ella.]{componente="SampleSpaceLab"}

```yaml
modo: frecuencia
experimento: cuatro-dados
eventoA: al-menos-un-seis
eventos: [al-menos-un-seis]
banda: true
referencia: 0.5
ensayos: 10000
```

:::

## Propiedades

- **Consistencia:** $\hat{p}_N \to p$ cuando $N \to \infty$, por la ley de los grandes números.
- **Tasa $1/\sqrt{N}$:** para reducir el error a la mitad hay que cuadruplicar $N$; para ganar una cifra decimal, multiplicarlo por 100.
- **Planeación:** para un margen de error $e$ al 95 % basta $N \approx 1.96^2\, p(1-p)/e^2 \le 0.9604/e^2$. Para $e = 0.01$ bastan unas 9604 simulaciones.
- **Independencia de la dimensión:** el error no depende de cuán complicado sea el experimento, solo de $p$ y de $N$.
- **Eventos raros:** si $p$ es pequeña, el error relativo es cercano a $1/\sqrt{Np}$: se necesitan del orden de $100/p$ simulaciones para un error relativo de 10 %.

:::figura[El método no depende del tipo de problema: aquí estima la probabilidad de que x al cuadrado + bx + c = 0 tenga raíces reales con b uniforme en [0, 2] y c uniforme en [0, 1], cuyo valor exacto es 1/3.]{componente="GeometricProbability"}

```yaml
escenario: raices-reales
bMax: 2
cMax: 1
```

:::

:::figura[Ocho simulaciones independientes del mismo problema: cada una produce una estimación distinta, pero todas quedan casi siempre dentro de la banda, que se estrecha como uno entre la raíz de N.]{componente="SampleSpaceLab"}

```yaml
modo: frecuencia
experimento: cuatro-dados
eventoA: todos-distintos
eventos: [todos-distintos]
trayectorias: 8
banda: true
ensayos: 3000
```

:::

:::figura[Un evento raro, "la suma de dos dados es 2" con probabilidad 1/36: en escala logarítmica se ve que durante los primeros cientos de simulaciones la estimación salta entre 0 y valores muy altos.]{componente="SampleSpaceLab"}

```yaml
modo: frecuencia
experimento: dos-dados
eventoA: suma-2
eventos: [suma-2]
trayectorias: 5
banda: true
escalaLog: true
ensayos: 5000
```

:::

## Errores comunes

- **Reportar la estimación sin su error.** "La probabilidad es 0.52" no indica si el valor es confiable al primer o al tercer decimal.
- **Usar pocas simulaciones para distinguir valores cercanos.** Para decidir si una probabilidad es mayor que 0.5 cuando vale 0.518 se necesitan miles de simulaciones.
- **Simular un experimento distinto al real.** Si el modelo de simulación no refleja el experimento (por ejemplo, dados equilibrados cuando están cargados), la estimación converge con precisión al valor equivocado.
- **Reutilizar la misma semilla creyendo tener simulaciones nuevas.** Con la misma semilla, el generador produce exactamente la misma secuencia.

:::figura[Con solo 60 simulaciones de cuatro dados, las cinco estimaciones de P(al menos un 6) se reparten a ambos lados de 0.5: no alcanzan para decidir si la apuesta es favorable.]{componente="SampleSpaceLab"}

```yaml
modo: frecuencia
experimento: cuatro-dados
eventoA: al-menos-un-seis
eventos: [al-menos-un-seis]
trayectorias: 5
banda: true
ensayos: 60
```

:::

## Conexiones

La estimación por simulación es la [[interpretacion-frecuentista]] convertida en algoritmo, y extiende el [[metodo-de-monte-carlo-para-conteo-aproximado]] de conteos a probabilidades. La [[estimacion-de-pi-por-monte-carlo]] y la [[aguja-de-buffon]] son casos clásicos con [[probabilidad-geometrica]]. Su justificación teórica es la ley de los grandes números, y el intervalo de confianza viene del teorema central del límite; los métodos de Monte Carlo por cadenas de Markov extienden la idea a distribuciones de las que no se puede simular directamente.

## Formulario

:::formula[Estimador de Monte Carlo]

$$
\hat{p}_N = \frac{1}{N}\sum_{i=1}^{N} \mathbf{1}\{\omega_i \in A\}
$$

- $N$: número de simulaciones; $\omega_i$: resultado de la simulación $i$.
- $\mathbf{1}\{\cdot\}$: indicadora, 1 si se cumple la condición y 0 si no.
:::

:::formula[Error estándar]

$$
\mathrm{EE}(\hat{p}_N) = \sqrt{\frac{p(1-p)}{N}}
$$

- $p$: probabilidad verdadera; en la práctica se sustituye por $\hat{p}_N$.
:::

:::formula[Intervalo de 95 %]

$$
\hat{p}_N \pm 1.96\sqrt{\frac{\hat{p}_N(1 - \hat{p}_N)}{N}}
$$

- $1.96$: cuantil de la normal estándar para 95 % de confianza.
:::

:::formula[Número de simulaciones para un margen de error]

$$
N \approx \frac{1.96^2\, p(1-p)}{e^2} \le \frac{0.9604}{e^2}
$$

- $e$: margen de error deseado; la cota usa $p(1 - p) \le 1/4$.
:::

:::formula[Error relativo]

$$
\frac{\mathrm{EE}(\hat{p}_N)}{p} = \sqrt{\frac{1 - p}{N\,p}}
$$

- Crece cuando $p$ es pequeña: los eventos raros requieren muchas más simulaciones.
:::
