---
id: tcl-de-lyapunov
titulo: TCL de Lyapunov
titulo_en: Lyapunov central limit theorem
alias:
  - condición de Lyapunov
  - teorema central del límite de Liapunov
modulo: 3
submodulo: '3.1'
orden: 10
nivel: avanzado
prerrequisitos:
  - tcl-de-lindeberg-levy
etiquetas:
  - teorema central del límite
  - sumandos no idénticos
  - momentos de orden superior
  - condición de Lyapunov
resumen: >
  La suma de variables independientes con distribuciones distintas es aproximadamente normal si un
  momento de orden 2 + δ de los sumandos, comparado con la varianza total, se vuelve despreciable.
formula: '\frac{1}{s_n^{2+\delta}} \sum_{i=1}^{n} \mathbb{E}\big|X_i - \mu_i\big|^{2+\delta} \to 0 \ \Rightarrow\ \frac{1}{s_n}\sum_{i=1}^{n}(X_i - \mu_i) \xrightarrow{d} \mathcal{N}(0, 1)'
visualizacion:
  componente: CentralLimit
  parametros:
    modo: lyapunov
    escenario: uniformes-crecientes
    escenarios:
      - uniformes-crecientes
      - bernoulli-raiz
      - uniformes-geometricas
      - bernoulli-cuadraticas
    n: 30
referencias:
  - clave: durrett
  - clave: ross-probabilidad
publicado: true
---

## Intuición

Un proyecto de construcción tiene 30 tareas y el retraso de cada una respecto a su plan es incierto. Las tareas no son iguales: las del final son más grandes y su retraso puede variar más. El retraso total es una suma de variables independientes pero con distribuciones distintas, y el teorema de Lindeberg-Lévy no se aplica directamente. ¿Sigue siendo la suma aproximadamente normal?

La respuesta depende de que ninguna tarea domine. Si una sola tarea pudiera aportar casi toda la incertidumbre, la suma heredaría la forma de esa tarea. Lyapunov propuso una prueba sencilla de que eso no ocurre: comparar un momento un poco mayor que la varianza, típicamente el tercer momento absoluto, con la varianza total elevada a la potencia correspondiente. Si ese cociente se va a cero, cada sumando es pequeño frente al total y la suma estandarizada es aproximadamente normal. La condición es fácil de verificar en la práctica, aunque pide un poco más de lo estrictamente necesario.

## Definición

:::teorema[Teorema de Lyapunov]
Sean $X_1, X_2, \dots$ independientes, con $\mathbb{E}[X_i] = \mu_i$, $\operatorname{Var}(X_i) = \sigma_i^2$ finitas y $s_n^2 = \sum_{i=1}^n \sigma_i^2$. Si para algún $\delta > 0$
$$
\lim_{n \to \infty} \frac{1}{s_n^{2+\delta}} \sum_{i=1}^{n} \mathbb{E}\big|X_i - \mu_i\big|^{2+\delta} = 0,
$$
entonces
$$
\frac{1}{s_n}\sum_{i=1}^{n}(X_i - \mu_i) \xrightarrow{d} \mathcal{N}(0, 1).
$$
:::

Con $\delta = 1$ la condición compara la suma de los terceros momentos absolutos centrados con $s_n^3$. En el caso de variables idénticamente distribuidas con tercer momento finito, el cociente vale $\frac{\mathbb{E}|X - \mu|^3}{\sigma^3\sqrt{n}} \to 0$ y se recupera el teorema clásico.

:::nota[Qué significa cada símbolo]
- $X_i$: sumando $i$, independientes pero no necesariamente con la misma distribución.
- $\mu_i$, $\sigma_i^2$: media y varianza del sumando $i$.
- $s_n^2 = \sum \sigma_i^2$: varianza de la suma de los primeros $n$ sumandos; $s_n$, su desviación estándar.
- $\delta$: exceso sobre el orden 2 del momento usado; $\delta = 1$ da el tercer momento absoluto.
- $\mathbb{E}|X_i - \mu_i|^{2+\delta}$: momento absoluto centrado de orden $2 + \delta$.
- $\xrightarrow{d}$: convergencia en distribución.
:::

## Cómo usar la visualización

Cada paso simula una suma de $n$ sumandos con las leyes del escenario elegido, la divide entre $s_n$ y la agrega al histograma, que se compara con la normal estándar. El panel inferior grafica el cociente de Lyapunov con $\delta = 1$ en función de $n$ y marca el valor actual.

Con uniformes de ancho $\sqrt{i}$ el cociente baja de 0.63 en $n = 5$ a 0.27 en $n = 30$ y a 0.08 en $n = 300$, y el histograma se ajusta cada vez mejor a la campana. Con uniformes de ancho $1.6^i$ el cociente se estanca en 0.82: el último sumando aporta el 61 % de la varianza y el histograma conserva una forma achatada que no es normal. Con Bernoulli de probabilidad $1/(i+1)^2$ el cociente tampoco baja, porque la varianza total se mantiene acotada.

## Ejemplo

El retraso de la tarea $i$ de un proyecto es uniforme en $[-\sqrt{i}, \sqrt{i}]$ días, de forma independiente, para $i = 1, \dots, 30$.

1. Varianzas: $\sigma_i^2 = \frac{(\sqrt{i})^2}{3} = \frac{i}{3}$, así que $s_{30}^2 = \frac{1}{3}\sum_{i=1}^{30} i = \frac{465}{3} = 155$ y $s_{30} = 12.45$ días.
2. Terceros momentos: para una uniforme en $[-a, a]$, $\mathbb{E}|X|^3 = a^3/4$, así que $\sum_{i=1}^{30}\frac{i^{3/2}}{4} = 513.7$.
3. Cociente de Lyapunov con $\delta = 1$: $\frac{513.7}{155^{3/2}} = \frac{513.7}{1929.7} = 0.266$. En general es del orden de $1/\sqrt{n}$, así que tiende a cero.
4. Por el teorema, el retraso total es aproximadamente $\mathcal{N}(0, 155)$.
5. La probabilidad de un retraso total mayor que 20 días en valor absoluto es aproximadamente $2\big(1 - \Phi(20/12.45)\big) = 2(1 - \Phi(1.61)) = 0.108$.

:::figura[El ejemplo del proyecto: 30 retrasos uniformes de ancho √i. El cociente de Lyapunov vale 0.266 y el histograma de la suma estandarizada ya sigue la normal.]{componente="CentralLimit"}
```yaml
modo: lyapunov
escenario: uniformes-crecientes
n: 30
```
:::

## Propiedades

- **Implica la condición de Lindeberg:** por eso el teorema de Lyapunov es un caso particular del de Lindeberg-Feller.
- **Sumandos acotados:** si $|X_i - \mu_i| \le M$ para todo $i$ y $s_n \to \infty$, la condición se cumple con $\delta = 1$, pues el cociente es a lo más $M/s_n$.
- **Caso idéntico:** con tercer momento finito el cociente es $\rho/(\sigma^3\sqrt{n})$, la misma cantidad que aparece en la cota de Berry-Esseen.
- **Varianza total acotada:** si $s_n^2$ no crece, la condición falla y la suma no puede tender a la normal salvo que los sumandos ya sean normales.
- **Elección de $\delta$:** basta encontrar un $\delta > 0$ que funcione; valores mayores exigen más momentos.

:::figura[Propiedad: sumandos acotados con varianza total creciente. Bernoulli con pᵢ = 1/√(i + 1): el cociente baja lentamente porque la varianza total crece como √n.]{componente="CentralLimit"}
```yaml
modo: lyapunov
escenario: bernoulli-raiz
n: 200
```
:::

:::demostracion
Para ver que Lyapunov implica Lindeberg: en el evento $|X_i - \mu_i| > \varepsilon s_n$ se cumple $1 < \big(\frac{|X_i - \mu_i|}{\varepsilon s_n}\big)^{\delta}$. Entonces $\frac{1}{s_n^2}\sum \mathbb{E}\big[(X_i - \mu_i)^2\mathbf{1}\{|X_i - \mu_i| > \varepsilon s_n\}\big] \le \frac{1}{\varepsilon^{\delta}s_n^{2+\delta}}\sum \mathbb{E}|X_i - \mu_i|^{2+\delta} \to 0$.
:::

## Errores comunes

- **Pensar que basta con que cada sumando tenga varianza finita.** Si los anchos crecen geométricamente, el último sumando domina y la suma estandarizada no es normal.
- **Olvidar que la varianza total debe crecer.** Con probabilidades $1/(i+1)^2$ la suma de varianzas converge y la suma de los sumandos tiene un límite discreto, no normal.
- **Calcular el cociente sin centrar.** Los momentos van centrados en las medias $\mu_i$.
- **Creer que si la condición falla, la suma no es normal.** La condición es suficiente, no necesaria: sumas de normales independientes son normales aunque el cociente no tienda a cero.

:::figura[Error común: un sumando domina. Con anchos 1.6ⁱ el cociente de Lyapunov se estanca en 0.82 y el histograma no es normal.]{componente="CentralLimit"}
```yaml
modo: lyapunov
escenario: uniformes-geometricas
n: 40
```
:::

:::figura[Error común: varianza total acotada. Con pᵢ = 1/(i + 1)² la suma tiene casi siempre los mismos pocos valores y el histograma es discreto.]{componente="CentralLimit"}
```yaml
modo: lyapunov
escenario: bernoulli-cuadraticas
n: 100
```
:::

## Conexiones

Generaliza el [[tcl-de-lindeberg-levy]] a sumandos con distribuciones distintas y es un caso particular del [[tcl-de-lindeberg-feller]], cuya condición es más débil. Su cociente con $\delta = 1$ es la cantidad que controla el error en el [[teorema-de-berry-esseen]]. Pertenece a la familia del [[teorema-central-del-limite]] y se aplica, por ejemplo, a estimadores de regresión con diseños no idénticos.

## Formulario

:::formula[Condición de Lyapunov]
$$
\lim_{n \to \infty} \frac{1}{s_n^{2+\delta}} \sum_{i=1}^{n} \mathbb{E}\big|X_i - \mu_i\big|^{2+\delta} = 0
$$

- $X_i$: sumandos independientes.
- $\mu_i$: media de $X_i$.
- $s_n^2 = \sum_{i=1}^{n} \sigma_i^2$: varianza total.
- $\delta$: exceso positivo sobre el orden 2.
:::

:::formula[Conclusión]
$$
\frac{1}{s_n}\sum_{i=1}^{n}(X_i - \mu_i) \xrightarrow{d} \mathcal{N}(0, 1)
$$

- $s_n$: desviación estándar de la suma.
:::

:::formula[Momentos de una uniforme centrada]
$$
X \sim U(-a, a):\quad \operatorname{Var}(X) = \frac{a^2}{3},\qquad \mathbb{E}|X|^3 = \frac{a^3}{4}
$$

- $a$: semiancho del intervalo.
:::

:::formula[Caso idénticamente distribuido]
$$
\frac{\sum_{i=1}^{n}\mathbb{E}|X_i - \mu|^3}{s_n^3} = \frac{\rho}{\sigma^3\sqrt{n}}
$$

- $\rho = \mathbb{E}|X - \mu|^3$: tercer momento absoluto centrado.
- $\sigma$: desviación estándar de cada sumando.
:::
