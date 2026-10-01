---
id: tcl-de-lindeberg-feller
titulo: TCL de Lindeberg-Feller
titulo_en: Lindeberg-Feller central limit theorem
alias:
  - condición de Lindeberg
  - condición de Feller
  - teorema central del límite para arreglos triangulares
modulo: 3
submodulo: '3.1'
orden: 11
nivel: avanzado
prerrequisitos:
  - tcl-de-lyapunov
etiquetas:
  - teorema central del límite
  - condición de Lindeberg
  - sumandos no idénticos
  - arreglos triangulares
resumen: >
  Para sumandos independientes no idénticos, la condición de Lindeberg, que la varianza aportada por
  valores grandes sea despreciable, basta para el límite normal y es necesaria si ningún sumando domina.
formula: 'L_n(\varepsilon) = \frac{1}{s_n^2}\sum_{i=1}^{n}\mathbb{E}\Big[(X_i - \mu_i)^2\,\mathbf{1}\{|X_i - \mu_i| > \varepsilon s_n\}\Big] \to 0\ \ \forall \varepsilon > 0'
visualizacion:
  componente: CentralLimit
  parametros:
    modo: lindeberg
    escenario: bernoulli-raiz
    escenarios:
      - bernoulli-raiz
      - uniformes-crecientes
      - bernoulli-cuadraticas
      - uniformes-geometricas
      - normales-geometricas
    n: 60
    epsilon: 0.2
referencias:
  - clave: durrett
publicado: true
---

## Intuición

Un hospital atiende pacientes de muchos tipos y cada uno genera un costo con su propia distribución. El costo total del año es una suma de variables independientes pero distintas. Para que esa suma sea aproximadamente normal no hace falta que todos los pacientes sean iguales: hace falta que la incertidumbre total esté repartida entre muchos y que ningún caso extremo, de un solo paciente, pese tanto como el resto juntos.

La condición de Lindeberg mide exactamente eso. Fija un umbral proporcional a la desviación estándar del total y pregunta qué fracción de la varianza total proviene de valores que superan ese umbral. Si esa fracción se va a cero, para cualquier umbral relativo, la variabilidad se reparte en contribuciones pequeñas y la suma estandarizada se vuelve normal. Feller añadió el recíproco: si cada sumando, individualmente, es despreciable frente al total y la suma tiende a la normal, la condición de Lindeberg tenía que cumplirse. Así la condición queda caracterizada, salvo en el caso en que un solo sumando domina.

## Definición

:::teorema[Lindeberg-Feller]
Sean $X_1, X_2, \dots$ independientes con medias $\mu_i$, varianzas finitas $\sigma_i^2$ y $s_n^2 = \sum_{i=1}^n \sigma_i^2$. Se define
$$
L_n(\varepsilon) = \frac{1}{s_n^2}\sum_{i=1}^{n}\mathbb{E}\Big[(X_i - \mu_i)^2\,\mathbf{1}\{|X_i - \mu_i| > \varepsilon s_n\}\Big].
$$
1. **(Lindeberg)** Si $L_n(\varepsilon) \to 0$ para todo $\varepsilon > 0$, entonces $\frac{1}{s_n}\sum_{i=1}^{n}(X_i - \mu_i) \xrightarrow{d} \mathcal{N}(0, 1)$.
2. **(Feller)** Si $\max_{i \le n} \sigma_i^2/s_n^2 \to 0$ y la suma estandarizada converge a $\mathcal{N}(0, 1)$, entonces $L_n(\varepsilon) \to 0$ para todo $\varepsilon > 0$.
:::

El teorema vale también para **arreglos triangulares**: en la fila $n$ hay variables $X_{n,1}, \dots, X_{n,k_n}$ independientes entre sí, cuyas leyes pueden cambiar con $n$.

:::nota[Qué significa cada símbolo]
- $X_i$: sumandos independientes; $\mu_i$ y $\sigma_i^2$, su media y su varianza.
- $s_n^2$: varianza de la suma de los primeros $n$ sumandos; $s_n$, su desviación estándar.
- $\varepsilon$: umbral relativo; los valores con $|X_i - \mu_i| > \varepsilon s_n$ se consideran grandes.
- $\mathbf{1}\{\cdot\}$: indicadora, vale 1 si se cumple la condición y 0 si no.
- $L_n(\varepsilon)$: fracción de la varianza total que aportan los valores grandes.
- $\max_{i \le n} \sigma_i^2/s_n^2$: mayor fracción de la varianza que aporta un solo sumando (condición de Feller).
- $X_{n,j}$: sumando $j$ de la fila $n$ en un arreglo triangular; $k_n$, el número de sumandos de esa fila.
:::

## Cómo usar la visualización

El histograma acumula sumas estandarizadas $S_n/s_n$ simuladas y las compara con la normal. Debajo, cada barra es la fracción de la varianza que aporta el sumando $i$, y la parte resaltada es la que proviene de valores mayores que $\varepsilon s_n$; la suma de las partes resaltadas es $L_n(\varepsilon)$. El último panel grafica $L_n(\varepsilon)$ y la mayor fracción individual según $n$.

Con Bernoulli de probabilidad $1/\sqrt{i+1}$ y $\varepsilon = 0.2$, $L_n$ vale 0.71 en $n = 60$ y cae a cero en $n = 210$, cuando $\varepsilon s_n$ alcanza el mayor valor posible de $|X_i - \mu_i|$ y ningún valor cuenta como grande. Con normales de varianza $2^i$ la condición falla, la mayor fracción se queda en 1/2, y aun así el histograma es normal: es justo la excepción que la condición de Feller excluye.

## Ejemplo

Para sumandos $X_i \sim U(-\sqrt{i}, \sqrt{i})$ se verifica la condición de Lindeberg con $\varepsilon = 0.2$.

1. $\sigma_i^2 = i/3$ y $s_n^2 = \frac{n(n+1)}{6}$.
2. Cada $|X_i| \le \sqrt{i} \le \sqrt{n}$, así que si $\varepsilon s_n > \sqrt{n}$ ningún sumando supera el umbral y $L_n(\varepsilon) = 0$.
3. Basta $\varepsilon s_n \ge \sqrt{n}$, es decir, $\varepsilon^2\frac{n(n+1)}{6} \ge n$, que equivale a $n + 1 \ge \frac{6}{\varepsilon^2} = 150$: $n \ge 149$.
4. Antes de eso la suma todavía es positiva: con $n = 60$, $L_{60}(0.2) = 0.46$; con $n = 100$, $0.15$; desde $n = 149$, 0.
5. Para cualquier otro $\varepsilon$ el mismo argumento da $L_n(\varepsilon) = 0$ desde $n \ge 6/\varepsilon^2$, así que la condición se cumple y la suma estandarizada tiende a la normal.

:::figura[El ejemplo con uniformes de ancho √i y ε = 0.2: la parte resaltada de las barras se encoge y la suma de Lindeberg llega a cero en n = 149.]{componente="CentralLimit"}
```yaml
modo: lindeberg
escenario: uniformes-crecientes
n: 100
epsilon: 0.2
```
:::

## Propiedades

- **Lindeberg implica Feller:** si $L_n(\varepsilon) \to 0$, entonces $\max_i \sigma_i^2/s_n^2 \le \varepsilon^2 + L_n(\varepsilon)$, que puede hacerse tan pequeño como se quiera.
- **Lyapunov implica Lindeberg:** el teorema de Lyapunov es un caso particular.
- **Caso idénticamente distribuido:** $L_n(\varepsilon) = \frac{1}{\sigma^2}\mathbb{E}[(X - \mu)^2\mathbf{1}\{|X - \mu| > \varepsilon\sigma\sqrt{n}\}] \to 0$ por convergencia dominada, así que se recupera Lindeberg-Lévy con solo varianza finita.
- **Sumandos acotados:** si $|X_i - \mu_i| \le M$ y $s_n \to \infty$, $L_n(\varepsilon) = 0$ en cuanto $\varepsilon s_n > M$.
- **Varianza acotada:** si $s_n^2$ converge a un valor finito, la condición falla.

:::figura[Propiedad: sumandos acotados. Con Bernoulli de probabilidad 1/√(i + 1), la suma de Lindeberg cae a cero cuando ε sₙ supera 1.]{componente="CentralLimit"}
```yaml
modo: lindeberg
escenario: bernoulli-raiz
n: 250
epsilon: 0.2
```
:::

:::figura[Propiedad: la varianza total acotada hace fallar la condición. Con pᵢ = 1/(i + 1)² los primeros sumandos concentran casi toda la varianza.]{componente="CentralLimit"}
```yaml
modo: lindeberg
escenario: bernoulli-cuadraticas
n: 40
epsilon: 0.2
```
:::

:::demostracion
Para la primera propiedad: $\sigma_i^2 = \mathbb{E}[(X_i - \mu_i)^2\mathbf{1}\{|X_i - \mu_i| \le \varepsilon s_n\}] + \mathbb{E}[(X_i - \mu_i)^2\mathbf{1}\{|X_i - \mu_i| > \varepsilon s_n\}] \le \varepsilon^2 s_n^2 + s_n^2 L_n(\varepsilon)$. Al dividir entre $s_n^2$ y tomar el máximo sobre $i$ se obtiene la desigualdad.
:::

## Errores comunes

- **Creer que la condición de Lindeberg es necesaria siempre.** Si un sumando domina, como en normales con varianzas $2^i$, la suma puede ser normal sin que se cumpla; la necesidad requiere la condición de Feller.
- **Confundir "cada sumando tiene varianza finita" con la condición.** Uniformes de ancho $1.6^i$ tienen todas varianza finita, pero el último aporta 61 % del total y la suma no es normal.
- **Fijar un solo $\varepsilon$.** La condición debe cumplirse para todo $\varepsilon > 0$.
- **Olvidar el centrado.** Los valores grandes se miden respecto a la media de cada sumando.

:::figura[Error común: la condición no es necesaria si un sumando domina. Con normales de varianza 2ⁱ, Lindeberg falla y la mayor fracción se queda en 1/2, pero la suma es exactamente normal.]{componente="CentralLimit"}
```yaml
modo: lindeberg
escenario: normales-geometricas
n: 30
epsilon: 0.2
```
:::

:::figura[Error común: varianzas finitas no bastan. Con anchos 1.6ⁱ la barra del último sumando es enorme y el histograma no se parece a la normal.]{componente="CentralLimit"}
```yaml
modo: lindeberg
escenario: uniformes-geometricas
n: 30
epsilon: 0.2
```
:::

## Conexiones

Es la forma más general del [[teorema-central-del-limite]] para sumas de variables independientes: contiene al [[tcl-de-lindeberg-levy]] y al [[tcl-de-lyapunov]] como casos particulares. Se usa para probar normalidad asintótica de estimadores con observaciones no idénticas, como los coeficientes de regresión, y sus ideas reaparecen en el [[tcl-multivariado]] mediante proyecciones. El [[teorema-de-berry-esseen]] cuantifica la velocidad cuando hay terceros momentos.

## Formulario

:::formula[Suma de Lindeberg]
$$
L_n(\varepsilon) = \frac{1}{s_n^2}\sum_{i=1}^{n}\mathbb{E}\Big[(X_i - \mu_i)^2\,\mathbf{1}\{|X_i - \mu_i| > \varepsilon s_n\}\Big]
$$

- $X_i$, $\mu_i$: sumandos independientes y sus medias.
- $s_n^2$: varianza total.
- $\varepsilon$: umbral relativo positivo.
- $\mathbf{1}\{\cdot\}$: indicadora.
:::

:::formula[Teorema de Lindeberg]
$$
L_n(\varepsilon) \to 0\ \ \forall \varepsilon > 0 \ \Rightarrow\ \frac{1}{s_n}\sum_{i=1}^{n}(X_i - \mu_i) \xrightarrow{d} \mathcal{N}(0, 1)
$$

- $s_n$: desviación estándar de la suma.
:::

:::formula[Condición de Feller]
$$
\max_{i \le n}\frac{\sigma_i^2}{s_n^2} \to 0
$$

- $\sigma_i^2$: varianza del sumando $i$.
- Con ella, la condición de Lindeberg se vuelve también necesaria.
:::

:::formula[Cota de la mayor fracción]
$$
\max_{i \le n}\frac{\sigma_i^2}{s_n^2} \le \varepsilon^2 + L_n(\varepsilon)
$$

- Muestra que Lindeberg implica Feller.
:::

:::formula[Umbral del ejemplo]
$$
\varepsilon^2\,\frac{n(n+1)}{6} \ge n \iff n + 1 \ge \frac{6}{\varepsilon^2}
$$

- $n(n+1)/6$: varianza total de las uniformes de ancho $\sqrt{i}$.
- $\varepsilon$: umbral relativo.
:::
