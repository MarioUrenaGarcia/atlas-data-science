---
id: teorema-de-donsker
titulo: Teorema de Donsker
titulo_en: Donsker's theorem
alias:
  - principio de invariancia
  - teorema central del límite funcional
modulo: 3
submodulo: '3.1'
orden: 23
nivel: avanzado
prerrequisitos:
  - teorema-de-glivenko-cantelli
  - tcl-multivariado
etiquetas:
  - movimiento browniano
  - puente browniano
  - caminata aleatoria
  - Kolmogorov-Smirnov
  - procesos empíricos
resumen: >
  Una caminata aleatoria comprimida al intervalo [0, 1] y dividida entre σ√n converge, como trayectoria
  completa, al movimiento browniano; el proceso empírico √n(Fₙ - F) converge al puente browniano.
formula: 'W_n(t) = \frac{S_{\lfloor nt \rfloor}}{\sigma\sqrt{n}} \xrightarrow{d} B(t)\ \text{en } [0, 1], \qquad \sqrt{n}\,\big(F_n(x) - F(x)\big) \xrightarrow{d} \mathbb{B}\big(F(x)\big)'
visualizacion:
  componente: EmpiricalProcessViz
  parametros:
    modo: donsker-caminata
    nivel: 3
referencias:
  - clave: durrett
  - clave: karlin-taylor
publicado: true
---

## Intuición

En un almacén entran y salen cajas cada hora, y la diferencia acumulada entre entradas y salidas sube o baja una unidad cada vez. Vista de cerca, esa diferencia es una escalera irregular; vista desde lejos, después de muchas horas y con la escala vertical ajustada, parece una curva continua que tiembla en todas las escalas. Esa curva es el movimiento browniano.

El teorema central del límite describe la distribución de la caminata en un solo instante. El teorema de Donsker describe la trayectoria completa: comprimida al intervalo de tiempo $[0, 1]$ y dividida entre $\sqrt{n}$, la caminata converge al movimiento browniano como objeto aleatorio. La consecuencia práctica es enorme: cualquier cantidad que dependa de forma continua de toda la trayectoria, como el máximo, el tiempo pasado por encima de cero o el área bajo la curva, tiene como límite la cantidad correspondiente del movimiento browniano, sin importar la distribución de los pasos. Por eso se llama principio de invariancia. La misma idea aplicada a la distribución empírica produce el puente browniano y explica la prueba de Kolmogorov-Smirnov.

## Definición

:::teorema[Donsker para caminatas]
Sean $X_1, X_2, \dots$ independientes e idénticamente distribuidas con media 0 y varianza $\sigma^2 \in (0, \infty)$, $S_k = X_1 + \cdots + X_k$, y
$$
W_n(t) = \frac{S_{\lfloor nt \rfloor}}{\sigma\sqrt{n}}, \qquad t \in [0, 1].
$$
Entonces $W_n$ converge en distribución, como proceso con trayectorias en $[0, 1]$, a un movimiento browniano estándar $B$. En consecuencia, $h(W_n) \xrightarrow{d} h(B)$ para todo funcional $h$ continuo respecto de la distancia uniforme entre trayectorias.
:::

:::teorema[Donsker para el proceso empírico]
Si $X_1, X_2, \dots$ son independientes con función de distribución continua $F$, el proceso $\sqrt{n}\,(F_n(x) - F(x))$ converge en distribución a $\mathbb{B}(F(x))$, donde $\mathbb{B}$ es un puente browniano en $[0, 1]$. En particular,
$$
\sqrt{n}\,D_n = \sqrt{n}\sup_x |F_n(x) - F(x)| \xrightarrow{d} K = \sup_{u \in [0, 1]} |\mathbb{B}(u)|,
$$
con $P(K \le x) = 1 - 2\sum_{j=1}^{\infty}(-1)^{j-1}e^{-2j^2x^2}$.
:::

:::nota[Qué significa cada símbolo]
- $X_i$: pasos independientes con media 0 y varianza $\sigma^2$.
- $S_k$: suma de los primeros $k$ pasos; $\lfloor nt \rfloor$, parte entera de $nt$.
- $W_n(t)$: caminata comprimida al tiempo $[0, 1]$ y escalada por $\sigma\sqrt{n}$.
- $B$: movimiento browniano estándar, con $B(0) = 0$, incrementos independientes y $B(t) \sim \mathcal{N}(0, t)$.
- $h$: funcional de la trayectoria, por ejemplo su máximo.
- $F_n$, $F$: distribución empírica y verdadera; $D_n$, su mayor diferencia.
- $\mathbb{B}$: puente browniano, un movimiento browniano obligado a valer 0 en $t = 0$ y en $t = 1$.
- $K$: variable con distribución de Kolmogorov.
:::

## Cómo usar la visualización

Se dibujan 25 caminatas de $n = 2^k$ pasos $\pm 1$ comprimidas a $[0, 1]$ y divididas entre $\sqrt{n}$; la reproducción duplica $n$ hasta 2048. Abajo, el histograma del máximo de 2000 caminatas reescaladas se compara con la densidad $2\phi(x)$ del máximo browniano en $[0, 1]$.

Con $n = 8$ las trayectorias son escaleras toscas y el histograma del máximo está concentrado en pocos valores. Al llegar a $n = 2048$ las trayectorias tienen la textura áspera del movimiento browniano y la fracción de máximos mayores que 1 se acerca a $2(1 - \Phi(1)) = 0.317$, la probabilidad browniana.

## Ejemplo

En un almacén la diferencia entre cajas que entran y salen cambia en $\pm 1$ cada hora con igual probabilidad. Se pregunta la probabilidad de que en $n = 10000$ horas la diferencia acumulada llegue alguna vez a 100 cajas.

1. Con $\sigma = 1$, el nivel 100 corresponde a $W_n = 100/\sqrt{10000} = 1$.
2. El máximo de la trayectoria es un funcional continuo, así que $\max_{k \le n} S_k/\sqrt{n} \xrightarrow{d} \max_{t \le 1} B(t)$.
3. Por el principio de reflexión, $P(\max_{t \le 1} B(t) \ge a) = 2P(B(1) \ge a) = 2(1 - \Phi(a))$.
4. Con $a = 1$: $P \approx 2(1 - 0.8413) = 0.317$.
5. Comparación: la probabilidad de terminar por encima de 100 es solo $1 - \Phi(1) = 0.159$; la de tocar ese nivel en algún momento es el doble.

:::figura[El ejemplo del almacén: con 2048 pasos el máximo de la caminata reescalada sigue la densidad 2φ(x), y P(máximo > 1) se acerca a 0.317.]{componente="EmpiricalProcessViz"}
```yaml
modo: donsker-caminata
nivel: 11
```
:::

## Propiedades

- **Invariancia:** el límite no depende de la distribución de los pasos, solo de su varianza.
- **Funcionales continuos:** el máximo, el mínimo, $\int_0^1 W_n(t)\,dt$ y el tiempo positivo tienen como límite los del movimiento browniano; el tiempo pasado por encima de 0 sigue la ley del arcoseno.
- **Prueba de Kolmogorov-Smirnov:** se rechaza que los datos vengan de $F$ si $\sqrt{n}\,D_n > 1.358$ al nivel 0.05, porque $P(K > 1.358) = 0.05$.
- **Media de la distancia:** $\mathbb{E}[K] = \sqrt{\pi/2}\log 2 \approx 0.869$.
- **Versión multivariada:** las distribuciones finito-dimensionales de $W_n$ convergen a las del browniano por el teorema central del límite multivariado; la parte difícil del teorema es controlar las oscilaciones entre esos puntos.

:::figura[Propiedad: el proceso empírico se vuelve un puente browniano. Las curvas √n(Fₙ(u) - u) empiezan y terminan en 0, y √n Dₙ sigue la distribución de Kolmogorov.]{componente="EmpiricalProcessViz"}
```yaml
modo: donsker-empirico
n: 200
```
:::

:::demostracion
Idea: para tiempos fijos $0 < t_1 < \cdots < t_k \le 1$, los incrementos $W_n(t_j) - W_n(t_{j-1})$ son sumas de bloques disjuntos de pasos, independientes entre sí y, por el teorema central del límite, aproximadamente $\mathcal{N}(0, t_j - t_{j-1})$; esa es la ley de los incrementos brownianos. Falta probar que las trayectorias no oscilan demasiado entre esos tiempos (tensión), lo que se hace con desigualdades maximales para sumas de variables independientes.
:::

## Errores comunes

- **Pensar que basta con el teorema central del límite en cada instante.** La convergencia de cada $W_n(t)$ no da la del máximo; hace falta la convergencia de toda la trayectoria.
- **Olvidar el reescalamiento.** Sin dividir entre $\sqrt{n}$ las trayectorias crecen sin límite; sin comprimir el tiempo no hay un intervalo fijo donde comparar.
- **Aplicar las tablas de Kolmogorov-Smirnov con parámetros estimados.** El límite cambia; para normalidad con media y varianza estimadas se usa la prueba de Lilliefors.
- **Confundir movimiento browniano con puente browniano.** El proceso empírico está atado a 0 en ambos extremos, porque $F_n$ y $F$ valen 0 y 1 en los extremos.

:::figura[Error común: n pequeño. Con n = 4 pasos la caminata reescalada es una escalera de pocos escalones y su máximo solo toma unos cuantos valores.]{componente="EmpiricalProcessViz"}
```yaml
modo: donsker-caminata
nivel: 2
```
:::

## Conexiones

Extiende el [[teorema-central-del-limite]] y el [[tcl-multivariado]] a trayectorias completas, y describe las fluctuaciones del [[teorema-de-glivenko-cantelli]]. Combinado con el [[teorema-del-mapeo-continuo]] da los límites de funcionales como el máximo. La [[ley-del-logaritmo-iterado]] tiene una versión funcional análoga, y la [[convergencia-en-distribucion]] en espacios de funciones es su marco general.

## Formulario

:::formula[Caminata reescalada]
$$
W_n(t) = \frac{S_{\lfloor nt \rfloor}}{\sigma\sqrt{n}} \xrightarrow{d} B(t),\ t \in [0, 1]
$$

- $S_k$: suma de $k$ pasos con media 0 y varianza $\sigma^2$.
- $B$: movimiento browniano estándar.
:::

:::formula[Máximo del movimiento browniano]
$$
P\Big(\max_{0 \le t \le 1} B(t) \ge a\Big) = 2\big(1 - \Phi(a)\big),\ a \ge 0
$$

- $a$: nivel.
- $\Phi$: distribución normal estándar.
:::

:::formula[Proceso empírico]
$$
\sqrt{n}\,\big(F_n(x) - F(x)\big) \xrightarrow{d} \mathbb{B}\big(F(x)\big)
$$

- $F_n$: distribución empírica; $F$: verdadera, continua.
- $\mathbb{B}$: puente browniano.
:::

:::formula[Distribución de Kolmogorov]
$$
P(K \le x) = 1 - 2\sum_{j=1}^{\infty}(-1)^{j-1}e^{-2j^2x^2}
$$

- $K = \sup_u |\mathbb{B}(u)|$: límite de $\sqrt{n}\,D_n$.
- $j$: índice de la suma.
:::

:::formula[Valor crítico de Kolmogorov-Smirnov]
$$
\sqrt{n}\,D_n > 1.358 \Rightarrow \text{rechazo al nivel } 0.05
$$

- $D_n$: mayor diferencia entre $F_n$ y la $F$ propuesta.
:::
