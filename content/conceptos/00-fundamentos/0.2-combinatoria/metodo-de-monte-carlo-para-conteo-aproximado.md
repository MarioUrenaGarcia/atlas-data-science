---
id: metodo-de-monte-carlo-para-conteo-aproximado
titulo: Método de Monte Carlo para conteo aproximado
titulo_en: Monte Carlo approximate counting
alias:
  - conteo por Monte Carlo
  - estimación de cardinalidades por muestreo
  - conteo aproximado
modulo: 0
submodulo: '0.2'
orden: 25
nivel: intermedio
prerrequisitos:
  - principio-del-producto
  - relaciones-de-recurrencia-lineales
etiquetas:
  - Monte Carlo
  - muestreo
  - estimación
  - conteo
resumen: >
  Para contar un conjunto A dentro de un universo U fácil de muestrear, se toman N muestras uniformes de U y se
  estima |A| como |U| por la fracción de muestras que caen en A. El error relativo baja como 1/raíz de N.
formula: '\widehat{|A|} = |U| \cdot \frac{1}{N}\sum_{i=1}^{N} \mathbf{1}\{X_i \in A\},\qquad X_i \sim \text{Uniforme}(U)'
visualizacion:
  componente: MonteCarloCounting
  parametros:
    problema: sin-unos-consecutivos
    largo: 16
referencias:
  - clave: blitzstein-hwang
  - clave: murphy
publicado: true
---

## Intuición

Para estimar cuántas personas en una ciudad de un millón de habitantes usan bicicleta, no hace falta preguntar a todas: se encuestan 1000 al azar, se observa que 43 la usan y se estima que cerca del 4.3 % de la ciudad, unas 43000 personas, lo hace. El método de Monte Carlo aplica la misma idea a problemas de conteo que son difíciles de resolver con fórmulas.

Si se quiere contar un conjunto $A$ que vive dentro de un universo $U$ del que es fácil tomar muestras al azar y cuyo tamaño se conoce, basta sortear muchos elementos de $U$ y ver qué fracción cae en $A$. Esa fracción, multiplicada por $|U|$, estima $|A|$. No se necesita listar $A$ ni encontrar una fórmula: solo poder reconocer si un elemento pertenece a él.

El precio es la incertidumbre: la estimación varía de una corrida a otra y su precisión mejora lentamente, con la raíz cuadrada del número de muestras. Además, cuando $A$ es una fracción muy pequeña de $U$, casi ninguna muestra cae en él y la estimación es muy imprecisa.

## Definición

Sea $A \subseteq U$ con $U$ finito y $|U|$ conocido. Se toman $X_1, \dots, X_N$ independientes con distribución uniforme en $U$.

:::definicion[Estimador de Monte Carlo]
$$
\widehat{|A|} = |U| \cdot \hat{p}, \qquad \hat{p} = \frac{1}{N}\sum_{i=1}^{N} \mathbf{1}\{X_i \in A\}.
$$
:::

Con $p = |A|/|U|$, el estimador es insesgado, $\mathbb{E}\big[\widehat{|A|}\big] = |A|$, y su error estándar es $|U|\sqrt{p(1-p)/N}$. Un intervalo aproximado del 95 % es
$$
|U|\left(\hat{p} \pm 1.96\sqrt{\hat{p}(1 - \hat{p})/N}\right).
$$
El **error relativo** es aproximadamente $\sqrt{\frac{1 - p}{pN}}$: para una precisión relativa fija, el número de muestras necesario crece como $1/p$.

## Cómo usar la visualización

Cada muestra es una cadena binaria de 16 bits elegida al azar; los pares de unos seguidos se resaltan y la muestra se marca como "cumple" o "no cumple". La gráfica muestra la estimación en función del número de muestras, con la banda del intervalo del 95 % y la línea del valor exacto, que se conoce gracias a la recurrencia de Fibonacci. El selector cambia a otro problema: subconjuntos de $\{1, \dots, 20\}$ con suma acotada.

Con cadenas de 16 bits la fracción que cumple es cercana a 4 % y la banda se estrecha lentamente. Al alargar las cadenas a 30 bits la fracción baja a cerca de 0.2 % y la estimación se vuelve muy errática con pocas muestras. En el problema de subconjuntos con suma máxima 105, un poco más de la mitad de todos los subconjuntos cumple y la estimación converge mucho más rápido.

## Ejemplo

Se estima el número de cadenas de 12 bits sin dos unos seguidos.

1. El universo tiene $|U| = 2^{12} = 4096$ cadenas.
2. Se toman $N = 2000$ cadenas al azar y 190 cumplen: $\hat{p} = 190/2000 = 0.095$.
3. Estimación: $4096 \cdot 0.095 \approx 389$.
4. Intervalo del 95 %: $0.095 \pm 1.96\sqrt{0.095 \cdot 0.905/2000} = 0.095 \pm 0.0129$, es decir, de 336 a 442 cadenas.
5. El valor exacto, por la recurrencia $a_n = a_{n-1} + a_{n-2}$ con $a_0 = 1$ y $a_1 = 2$, es $a_{12} = 377$, que está dentro del intervalo. El error relativo de la estimación es de 3 %.

:::figura[El ejemplo con cadenas de 12 bits: el valor exacto es 377, cerca del 9 % de las 4096 cadenas, y la estimación se estabiliza alrededor de él mientras la banda se estrecha.]{componente="MonteCarloCounting"}
```yaml
problema: sin-unos-consecutivos
largo: 12
```
:::

## Propiedades

- **Insesgadez:** $\mathbb{E}[\hat{p}] = p$, por la linealidad de la esperanza.
- **Consistencia:** $\hat{p} \to p$ cuando $N \to \infty$, por la ley de los grandes números.
- **Tasa:** el error estándar decrece como $1/\sqrt{N}$; para reducirlo a la mitad hay que cuadruplicar las muestras.
- **Eventos raros:** si $p$ es muy pequeño, se requieren del orden de $1/p$ muestras solo para ver algunos aciertos; en esos casos se usan muestreo por importancia o esquemas de conteo por etapas.
- **Independencia de la dimensión:** la tasa $1/\sqrt{N}$ no depende de la complejidad de $U$, lo que hace útil el método cuando la enumeración es imposible.

## Errores comunes

- **Muestrear de forma no uniforme.** Si las muestras no son uniformes en $U$, la fracción observada no estima $|A|/|U|$.
- **Confiar en pocas muestras cuando $p$ es pequeño.** Con 100 muestras y $p = 0.002$, lo más probable es no ver ningún acierto y estimar 0.
- **Esperar convergencia rápida.** Pasar de 1000 a 10000 muestras solo reduce el error a cerca de un tercio.
- **Olvidar reportar la incertidumbre.** Una estimación sin intervalo no indica qué tan confiable es.

## Conexiones

El método usa el [[principio-del-producto]] para conocer $|U|$ y se valida contra conteos exactos obtenidos con [[relaciones-de-recurrencia-lineales]]. Es la contraparte aproximada de los métodos exactos de este submódulo, útil cuando el [[principio-de-inclusion-y-exclusion]] o las [[funciones-generadoras-ordinarias]] no dan una fórmula manejable. Su justificación formal depende de la ley de los grandes números y del teorema central del límite, y es la base de la integración de Monte Carlo y de los métodos de muestreo en estadística bayesiana.
