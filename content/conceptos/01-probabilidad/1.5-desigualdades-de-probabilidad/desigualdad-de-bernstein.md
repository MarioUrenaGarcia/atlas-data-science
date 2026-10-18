---
id: desigualdad-de-bernstein
titulo: Desigualdad de Bernstein
titulo_en: Bernstein's inequality
alias:
  - cota de Bernstein
  - concentración con varianza
modulo: 1
submodulo: '1.5'
orden: 10
nivel: avanzado
prerrequisitos:
  - desigualdad-de-hoeffding
  - varianza
relaciones:
  - tipo: relacionado
    id: cota-de-chernoff
etiquetas:
  - varianza pequeña
  - variables acotadas
  - eventos raros
  - dos regímenes
resumen: >
  La desigualdad de Bernstein acota la desviación de un promedio usando la varianza y una cota de las
  variables. Cuando la varianza es pequeña, como en eventos raros, es mucho más fuerte que Hoeffding,
  que solo usa el rango.
formula: 'P\big(\bar{X}_n - \mu \ge t\big) \le \exp\!\left(-\frac{n t^2}{2\sigma^2 + \frac{2}{3} c\, t}\right), \qquad |X_i - \mu| \le c'
visualizacion:
  componente: InequalityBound
  parametros:
    modo: concentracion
    p: 0.1
    umbral: 0.05
    n: 600
    cotas: [bernstein, hoeffding]
referencias:
  - clave: wasserman
publicado: true
---

## Intuición

Una fábrica produce piezas defectuosas con probabilidad 0.01. ¿Qué tan probable es que en 2000 piezas la proporción de defectuosas llegue a 0.02? La desigualdad de Hoeffding solo sabe que cada pieza vale 0 o 1, así que se comporta como si la proporción pudiera variar tanto como la de una moneda equilibrada, y da una cota cercana a 0.67. Pero la proporción de defectos casi no varía: su varianza es $0.01 \cdot 0.99$, cien veces menor que la de una moneda.

La **desigualdad de Bernstein** aprovecha esa información. Usa la varianza $\sigma^2$ y una cota $c$ de las desviaciones, y en el ejemplo da una cota de 0.0005. Su forma tiene dos regímenes: para desviaciones pequeñas decae como una normal con la varianza verdadera, $e^{-nt^2/(2\sigma^2)}$, y para desviaciones grandes decae solo de manera exponencial, $e^{-3nt/(2c)}$.

## Definición

:::teorema[Desigualdad de Bernstein]
Sean $X_1, \dots, X_n$ independientes con media $\mu$, varianza $\sigma^2$ y $|X_i - \mu| \le c$. Para todo $t > 0$,
$$
P\big(\bar{X}_n - \mu \ge t\big) \le \exp\!\left(-\frac{n t^2}{2\sigma^2 + \frac{2}{3} c\, t}\right).
$$
:::

La prueba sigue el método de Chernoff y acota la función generadora usando que los momentos de orden $k \ge 2$ cumplen $\mathbb{E}|X_i - \mu|^k \le \sigma^2 c^{k-2}$.

:::figura[Eventos muy raros, $p = 0.02$ y desviación 0.02: la cota de Bernstein baja muchos órdenes de magnitud mientras la de Hoeffding apenas se mueve.]{componente="InequalityBound"}
```yaml
modo: concentracion
p: 0.02
umbral: 0.02
n: 1000
cotas: [bernstein, hoeffding]
```
:::

:::nota[Qué significa cada símbolo]
- $X_1, \dots, X_n$: variables independientes.
- $\mu$, $\sigma^2$: media y varianza de cada una.
- $c$: cota de $|X_i - \mu|$.
- $\bar{X}_n$: promedio; $t$: desviación.
- $p$: probabilidad de defecto del ejemplo.
:::

## Cómo usar la visualización

Para el promedio de $n$ ensayos con $p = 0.1$, la gráfica en escala logarítmica compara la probabilidad exacta de superar 0.15 con las cotas de Bernstein y Hoeffding. Bernstein usa $\sigma^2 = 0.09$ y $c = 0.9$; Hoeffding solo el rango 1. La pendiente de Bernstein es más del doble de empinada.

Las deslizaderas cambian $p$, $t$ y $n$. Al acercar $p$ a 0.5 las dos cotas se igualan e incluso Hoeffding queda un poco mejor; al alejarlo, Bernstein gana por mucho.

## Ejemplo

Piezas defectuosas con $p = 0.01$; se revisan $n = 2000$ y se pregunta por una proporción de 0.02 o más ($t = 0.01$).

1. Hoeffding: $e^{-2 \cdot 2000 \cdot 0.0001} = e^{-0.4} \approx 0.67$.
2. Bernstein, con $\sigma^2 = 0.0099$ y $c = 0.99$: el exponente es $\dfrac{2000 \cdot 0.0001}{0.0198 + 0.0066} = \dfrac{0.2}{0.0264} \approx 7.58$.
3. Cota de Bernstein: $e^{-7.58} \approx 0.0005$.
4. La probabilidad exacta es del orden de $10^{-4}$: Bernstein captura el orden de magnitud y Hoeffding no.

:::figura[El ejemplo de las piezas: con $p = 0.01$ y desviación 0.01, en $n = 2000$ la cota de Bernstein es cercana a 0.0005, la de Hoeffding 0.67.]{componente="InequalityBound"}
```yaml
modo: concentracion
p: 0.01
umbral: 0.01
n: 2000
cotas: [bernstein, hoeffding]
```
:::

## Propiedades

- **Régimen gaussiano:** si $t \ll \sigma^2/c$, la cota es aproximadamente $e^{-nt^2/(2\sigma^2)}$, la cola de una normal con la varianza verdadera.
- **Régimen exponencial:** si $t \gg \sigma^2/c$, la cota es aproximadamente $e^{-3nt/(2c)}$, más lenta que una cola gaussiana.
- **Mejor que Hoeffding con varianza pequeña:** como $\sigma^2 \le c^2$, Bernstein gana cuando $\sigma^2$ es mucho menor que el cuadrado del rango.
- **Versión de dos colas:** se multiplica la cota por 2.

:::figura[Una desviación del tamaño de $\sigma^2/c = 0.3$: con $p = 0.3$ y $t = 0.3$ el término lineal del denominador ya pesa, y la cota de Bernstein queda por encima de la de Chernoff.]{componente="InequalityBound"}
```yaml
modo: concentracion
p: 0.3
umbral: 0.3
n: 200
cotas: [bernstein, chernoff]
```
:::

## Errores comunes

- **Usar la varianza muestral como si fuera la verdadera.** La cota requiere la varianza poblacional o una cota superior de ella.
- **Olvidar la cota $c$.** Sin una cota de las desviaciones, la parte exponencial no está controlada y la desigualdad no aplica.
- **Esperar que siempre supere a Hoeffding.** Con $p = 1/2$ la varianza ya es la máxima y Bernstein es ligeramente peor.

:::figura[Con $p = 0.5$ la varianza es la máxima posible, 0.25, y la cota de Hoeffding queda un poco por debajo de la de Bernstein.]{componente="InequalityBound"}
```yaml
modo: concentracion
p: 0.5
umbral: 0.1
n: 300
cotas: [hoeffding, bernstein]
```
:::

## Conexiones

La desigualdad de Bernstein refina la [[desigualdad-de-hoeffding]] usando la [[varianza]], y se prueba con el método de la [[cota-de-chernoff]]. Su régimen gaussiano conecta con el [[teorema-central-del-limite]]: para desviaciones pequeñas, la cola se parece a la de la normal con la varianza verdadera. En aprendizaje estadístico da tasas más rápidas cuando la varianza de las pérdidas es pequeña.

## Formulario

:::formula[Desigualdad de Bernstein]
$$
P\big(\bar{X}_n - \mu \ge t\big) \le \exp\!\left(-\frac{n t^2}{2\sigma^2 + \frac{2}{3} c\, t}\right)
$$

- $|X_i - \mu| \le c$, varianza $\sigma^2$.
:::

:::formula[Régimen gaussiano]
$$
P\big(\bar{X}_n - \mu \ge t\big) \lesssim e^{-n t^2 / (2\sigma^2)}, \qquad t \ll \sigma^2 / c
$$

- Cola de una normal con varianza $\sigma^2/n$.
:::

:::formula[Condición de momentos]
$$
\mathbb{E}|X_i - \mu|^k \le \sigma^2 c^{k-2}, \qquad k \ge 2
$$

- Se cumple si $|X_i - \mu| \le c$.
:::
